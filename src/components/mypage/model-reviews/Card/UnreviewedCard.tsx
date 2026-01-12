'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { UnreviewedReservation } from '@/src/types';
import { categoryCodeToName, subCategoryCodeToName } from '@/src/utils/myRecruitment';
import { formatDateToKorean, formatTimeToKorean } from '@/src/utils/common';

interface UnreviewedCardProps {
  reservation: UnreviewedReservation;
}

export default function UnreviewedCard({
  reservation,
}: UnreviewedCardProps) {
  const router = useRouter();

  // 카테고리 한글 변환
  const categoryLabel = categoryCodeToName(
    reservation.category as 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH'
  ) ?? reservation.category;

  // 서브카테고리 한글 변환
  const subCategoryLabels = reservation.subCategories?.map((code) =>
    subCategoryCodeToName(reservation.category, code)
  ) ?? [];

  // 프로필 보기 클릭
  const handleProfileClick = () => {
    // 디자이너 프로필 페이지로 이동
    router.push(`/designer/${reservation.designerId}`);
  };

  // 리뷰 작성하기 클릭
  const handleWriteReviewClick = () => {
    router.push(`/mypage/reviews/write/${reservation.reservationId}`);
  };

  // 카드 제목 클릭 (공고 상세로 이동)
  const handleTitleClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white px-5 py-4">
      {/* 카테고리 뱃지 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {/* 메인 카테고리 뱃지 */}
          <span className="text-caption-1-medium rounded-lg bg-purple-600 px-2 py-1 text-white">
            {categoryLabel}
          </span>
          {/* 서브카테고리 뱃지 */}
          {subCategoryLabels.map((label) => (
            <span
              key={label}
              className="text-caption-1-medium rounded-lg bg-purple-200 px-2 py-1 text-purple-700"
            >
              {label}
            </span>
          ))}
        </div>

        {/* 공고 제목 */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleTitleClick}
            className="flex cursor-pointer items-center gap-0.5"
          >
            <p className="text-head-4-semibold text-gray-900">{reservation.recruitmentTitle}</p>
            <Image
              src="/icons/common/chevron-right.svg"
              alt="상세보기"
              width={20}
              height={20}
              className="text-gray-800"
            />
          </button>

          {/* 예약 정보 */}
          <div className="flex flex-col gap-1">
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">예약 일시</span>
              <span className="text-gray-900">
                {formatDateToKorean(reservation.date)} {formatTimeToKorean(reservation.startTime)}
              </span>
            </div>
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">디자이너</span>
              <span className="text-gray-900">{reservation.designerNickname}</span>
            </div>
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">매장명</span>
              <span className="text-gray-900">{reservation.shop}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={handleProfileClick}
          className="text-body-2-medium flex h-[41px] flex-1 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-5 py-2.5 text-gray-900"
        >
          프로필 보기
        </button>
        <button
          type="button"
          onClick={handleWriteReviewClick}
          className="text-body-2-medium flex h-[41px] flex-1 cursor-pointer items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-white"
        >
          리뷰 작성하기
        </button>
      </div>
    </div>
  );
}
