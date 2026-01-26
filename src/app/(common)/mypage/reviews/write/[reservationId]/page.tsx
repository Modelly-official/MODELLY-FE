'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CloseIcon from '@/public/icons/common/close.svg';
import { StarRatingInput } from '@/src/components/review';
import { ReviewImageUploader } from '@/src/components/mypage/model-reviews';
import { useUnreviewedReservations } from '@/src/hooks/queries/review';
import { useReviewForm } from '@/src/hooks/custom/review';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';
import type { UnreviewedReservation } from '@/src/types';

export default function ReviewWritePage() {
  const router = useRouter();
  const params = useParams();
  const reservationId = Number(params.reservationId);

  // 리뷰 미작성 예약 목록에서 현재 예약 정보 가져오기
  const { data: unreviewedData, isLoading: isLoadingReservation } = useUnreviewedReservations();

  // 현재 예약 정보 찾기 (무한 스크롤 pages에서 검색)
  const reservation: UnreviewedReservation | undefined = useMemo(() => {
    const allItems = unreviewedData?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
    return allItems.find((item) => item.reservationId === reservationId);
  }, [unreviewedData, reservationId]);

  // 리뷰 폼 훅
  const {
    rating,
    setRating,
    content,
    setContent,
    previewUrls,
    isValidForm,
    isSubmitting,
    handleImagesAdd,
    handleImageRemove,
    handleSubmit,
    maxContentLength,
    maxImages,
  } = useReviewForm({ reservationId, reservation });

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
            onClick={() => router.push('/mypage/reviews')}
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
          onClick={() => router.push('/mypage/reviews')}
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
                  if (e.target.value.length <= maxContentLength) {
                    setContent(e.target.value);
                  }
                }}
                placeholder="스타일, 직원 응대, 분위기 등 좋았던 점을 들려주세요! (10자 이상 작성)"
                className="h-[91px] w-full resize-none text-body-2-regular text-gray-900 placeholder:text-gray-600 focus:outline-none"
              />
              <div className="text-right">
                <span className="text-body-2-regular text-gray-600">
                  {content.length}/{maxContentLength}
                </span>
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <ReviewImageUploader
            previewUrls={previewUrls}
            onImagesAdd={handleImagesAdd}
            onImageRemove={handleImageRemove}
            maxImages={maxImages}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <FixedBottomContainer hasBorder>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValidForm || isSubmitting}
          className={`flex h-[56px] w-full cursor-pointer items-center justify-center rounded-full text-body-1-semibold transition-colors ${
            isValidForm && !isSubmitting
              ? 'bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-600'
          }`}
        >
          {isSubmitting ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            '작성하기'
          )}
        </button>
      </FixedBottomContainer>
    </div>
  );
}
