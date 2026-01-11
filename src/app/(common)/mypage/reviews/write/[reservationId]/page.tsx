'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CloseIcon from '@/public/icons/common/close.svg';
import { StarRatingInput } from '@/src/components/review';
import { ReviewImageUploader } from '@/src/components/mypage/reviews';
import { useUnreviewedReservations, useCreateReview } from '@/src/hooks/queries/review';
import { getReviewPresignedUrls } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import type { UnreviewedReservation } from '@/src/types';

// 최대 글자 수
const MAX_CONTENT_LENGTH = 100;
// 최소 글자 수
const MIN_CONTENT_LENGTH = 10;
// 최대 이미지 수
const MAX_IMAGES = 3;

export default function ReviewWritePage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const reservationId = Number(params.reservationId);

  // 리뷰 미작성 예약 목록에서 현재 예약 정보 가져오기
  const { data: unreviewedData, isLoading: isLoadingReservation } = useUnreviewedReservations();

  // 리뷰 작성 mutation
  const createReviewMutation = useCreateReview();

  // 현재 예약 정보 찾기
  const reservation: UnreviewedReservation | undefined = useMemo(() => {
    return unreviewedData?.result?.items?.find(
      (item) => item.reservationId === reservationId
    );
  }, [unreviewedData, reservationId]);

  // 폼 상태
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 유효성 검사
  const isValidForm = useMemo(() => {
    return (
      rating > 0 &&
      content.length >= MIN_CONTENT_LENGTH &&
      content.length <= MAX_CONTENT_LENGTH
    );
  }, [rating, content]);

  // 이미지 추가 핸들러
  const handleImagesAdd = (files: File[]) => {
    const newFiles = [...imageFiles, ...files].slice(0, MAX_IMAGES);
    setImageFiles(newFiles);

    // 미리보기 URL 생성
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    // 이전 URL들 해제
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls(newPreviews);
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);

    // 미리보기 URL 업데이트
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // 이미지 업로드 함수
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    // Presigned URL 발급 (reservationId 필요)
    const presignedResponse = await getReviewPresignedUrls(reservationId, files.length);
    if (!presignedResponse.isSuccess || !presignedResponse.result?.presignedUrls) {
      throw new Error('이미지 업로드 URL을 가져오지 못했습니다.');
    }

    const uploadPromises = files.map(async (file, index) => {
      const { uploadUrl, imageUrl } = presignedResponse.result!.presignedUrls[index];

      // S3에 직접 업로드
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`이미지 업로드 실패 (${uploadRes.status})`);
      }

      return imageUrl;
    });

    return Promise.all(uploadPromises);
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!isValidForm || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 이미지 업로드
      const uploadedImageUrls = await uploadImages(imageFiles);

      // 리뷰 작성 API 호출
      await createReviewMutation.mutateAsync({
        reservationId,
        data: {
          rating,
          content,
          imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
        },
      });

      // 성공 시 목록으로 이동
      router.push('/mypage/reviews');
    } catch (error) {
      // useCreateReview hook에서 이미 toast 표시하므로 여기서는 로깅만
      console.error('리뷰 등록 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 상태
  if (isLoadingReservation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="size-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  // 예약 정보가 없는 경우
  if (!reservation) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <header className="flex items-center justify-between bg-white px-4 py-3">
          <div className="size-6" />
          <h1 className="text-head-4-medium text-center text-black">리뷰 작성하기</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-6 cursor-pointer items-center justify-center"
            aria-label="닫기"
          >
            <CloseIcon className="text-black" />
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-2-medium text-gray-700">예약 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-white px-4 py-3">
        <div className="size-6" />
        <h1 className="text-head-4-medium text-center text-black">리뷰 작성하기</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="닫기"
        >
          <CloseIcon className="text-black" />
        </button>
      </header>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* 타이틀 섹션 */}
        <div className="flex flex-col gap-3 pt-4">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-head-3-semibold text-black">
              디자이너와의 시술 경험은 어땠나요?
            </h2>
            <p className="text-body-2-medium text-gray-800">
              {reservation.designerNickname} 디자이너 · {reservation.shop}
            </p>
          </div>

          {/* 별점 입력 */}
          <div className="flex justify-center px-4">
            <StarRatingInput
              rating={rating}
              onChange={setRating}
              size={40}
            />
          </div>
        </div>

        {/* 리뷰 내용 입력 */}
        <div className="mt-5 flex flex-col gap-5">
          {/* 텍스트 입력 영역 */}
          <div className="flex flex-col gap-2 rounded-2xl bg-gray-200 p-4">
            <div className="flex items-start gap-1">
              <span className="text-body-1-semibold text-gray-900">
                시술 전반에 대한 경험은 어떠셨나요?
              </span>
              <span className="text-head-3-semibold text-purple-500">*</span>
            </div>
            <div className="flex h-[156px] flex-col justify-between rounded-xl bg-white p-4">
              <textarea
                value={content}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CONTENT_LENGTH) {
                    setContent(e.target.value);
                  }
                }}
                placeholder="스타일, 직원 응대, 분위기 등 좋았던 점을 들려주세요!"
                className="h-[91px] w-full resize-none text-body-2-regular text-gray-900 placeholder:text-gray-600 focus:outline-none"
              />
              <div className="text-right">
                <span className="text-body-2-regular text-gray-600">
                  {content.length}/{MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <ReviewImageUploader
            previewUrls={previewUrls}
            onImagesAdd={handleImagesAdd}
            onImageRemove={handleImageRemove}
            maxImages={MAX_IMAGES}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[375px] border-t border-gray-100 bg-white px-4 pb-2 pt-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValidForm || isSubmitting}
          className={`w-full rounded-full py-4 text-body-1-semibold transition-colors ${
            isValidForm && !isSubmitting
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isSubmitting ? '작성 중...' : '작성하기'}
        </button>
      </div>
    </div>
  );
}
