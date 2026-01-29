'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReservationHeader, ReservationImageUpload } from '@/src/components/reservation';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import { getReservationPresignedUrl } from '@/src/apis/reservation/model';
import { uploadImageToS3 } from '@/src/apis/auth/profile';
import { useToast } from '@/src/hooks/common/useToast';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';
import { isPhotoRequired } from '@/src/utils/reservation/photoRequirement';
import { Spinner } from '@/src/components/auth/common';

interface StepPhotoProps {
  category: string;
  goNext: () => void;
  goPrev: () => void;
}

// 카테고리별 안내 문구
const CATEGORY_INSTRUCTIONS: Record<string, string[]> = {
  // 한글
  헤어: ['헤어: 머리 전체 길이가 보이도록 촬영해주세요.'],
  네일: ['네일: 현재 손톱 상태가 보이도록 촬영해주세요.'],
  속눈썹: ['속눈썹: 눈을 감은 상태로 정면 촬영해주세요.'],
  타투: ['타투: 시술 부위가 잘 보이도록 촬영해주세요.'],
  default: ['시술 부위가 잘 보이도록 촬영해주세요.'],
};

export default function StepPhoto({ category, goNext, goPrev }: StepPhotoProps) {
  const { uploadedImageUrl, setUploadedImageUrl } = useReservationStore();
  const { showToast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(uploadedImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  // 사진 필수 여부 확인
  const photoRequired = isPhotoRequired(category);

  // 스토어의 uploadedImageUrl 변경 시 previewUrl 동기화
  useEffect(() => {
    setPreviewUrl(uploadedImageUrl);
  }, [uploadedImageUrl]);

  // 카테고리별 안내 문구 가져오기
  const instructions = CATEGORY_INSTRUCTIONS[category] || CATEGORY_INSTRUCTIONS.default;

  // 이미지 선택 핸들러
  const handleImageSelect = useCallback(
    async (file: File) => {
      // 미리보기 URL 생성
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setIsUploading(true);

      try {
        // Presigned URL 가져오기
        const response = await getReservationPresignedUrl();
        if (!response.result) {
          throw new Error('Presigned URL을 가져오지 못했습니다.');
        }

        const { uploadUrl, imageUrl: s3ImageUrl } = response.result;

        // S3에 이미지 업로드
        await uploadImageToS3(uploadUrl, file);

        // 스토어에 이미지 URL 저장
        setUploadedImageUrl(s3ImageUrl);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        showToast('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        setPreviewUrl(null);
        setUploadedImageUrl(null);
      } finally {
        setIsUploading(false);
      }
    },
    [setUploadedImageUrl, showToast],
  );

  // 이미지 삭제 핸들러
  const handleImageRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedImageUrl(null);
  }, [previewUrl, setUploadedImageUrl]);

  // 다음 버튼 활성화 조건
  const canProceed = photoRequired
    ? uploadedImageUrl !== null && !isUploading
    : !isUploading;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ReservationHeader onBack={goPrev} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-6 px-4 pb-[250px]">
        {/* 스텝 정보 */}
        <div className="flex flex-col gap-2">
          <p className="text-[20px] leading-[1.4] font-normal tracking-[-0.4px]">
            <span className="text-gray-900">2</span>
            <span className="text-gray-600">/4</span>
          </p>

          <div className="flex flex-col gap-3">
            <h1 className="text-head-2-semibold text-gray-900">
              예약 신청을 위해
              <br />
              {photoRequired ? (
                '필수 사진을 첨부해주세요.'
              ) : (
                <>
                  사진을 첨부해주세요.{' '}
                  <span className="text-body-1-medium text-gray-500">(선택)</span>
                </>
              )}
            </h1>

            {/* 안내 문구 */}
            <ul className="flex flex-col gap-1">
              {instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-body-2-regular text-gray-600">•</span>
                  <span className="text-body-2-regular text-gray-600">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <ReservationImageUpload
          previewUrl={previewUrl}
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
        />

        {/* 업로드 중 표시 */}
        {isUploading && (
          <div className="flex items-center justify-center gap-2">
            <Spinner color="gray" size="sm" />
            <span className="text-body-2-regular text-gray-500">이미지 업로드 중…</span>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <FixedBottomContainer>
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className={`text-body-1-semibold h-14 w-full rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
            canProceed ? 'cursor-pointer bg-gray-900 text-white' : 'cursor-not-allowed bg-gray-200 text-gray-500'
          }`}
        >
          다음
        </button>
      </FixedBottomContainer>
    </div>
  );
}
