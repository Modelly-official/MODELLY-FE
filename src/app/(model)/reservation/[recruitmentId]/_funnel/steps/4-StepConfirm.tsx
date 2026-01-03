'use client';

import { ReservationHeader } from '@/src/components/reservation';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import { useCreateReservation } from '@/src/hooks/queries/reservation';
import {
  categoryNameToCode,
  categoryCodeToName,
  subCategoryNameToCode,
  subCategoryCodeToName,
} from '@/src/utils/myRecruitment/category/categoryMapping';

interface StepConfirmProps {
  recruitmentId: number;
  shopName: string;
  branchName?: string;
  designerName: string;
  category: string;
  subCategories: string[];
  goNext: () => void;
  goPrev: () => void;
}

// 날짜 포맷팅 (yyyy-MM-dd → yyyy년 M월 d일)
// 타임존 이슈 방지를 위해 문자열 직접 파싱
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

// 시간 포맷팅 (HH:mm → 오전/오후 HH:mm)
function formatTime(timeStr: string): string {
  const [hours] = timeStr.split(':').map(Number);
  const period = hours < 12 ? '오전' : '오후';
  return `${period} ${timeStr}`;
}

export default function StepConfirm({
  recruitmentId,
  shopName,
  branchName,
  designerName,
  category,
  subCategories,
  goNext,
  goPrev,
}: StepConfirmProps) {
  const { selectedDate, selectedTime, uploadedImageUrl, comment } = useReservationStore();
  const { mutate: createReservation, isPending } = useCreateReservation();

  // 카테고리 enum 변환 (한글/영문 모두 처리)
  const categoryEnum = categoryNameToCode(category);

  // 예약하기 버튼 클릭
  const handleReservation = () => {
    if (!selectedDate || !selectedTime || !uploadedImageUrl || !categoryEnum) return;

    const shop = branchName ? `${shopName} ${branchName}` : shopName;

    // 서브카테고리 한글 → enum 변환
    const subCategoriesEnum = subCategories.map((sub) =>
      subCategoryNameToCode(categoryEnum, sub)
    );

    createReservation(
      {
        recruitmentId,
        date: selectedDate,
        startTime: selectedTime,
        category: categoryEnum,
        subCategories: subCategoriesEnum,
        comment,
        designerName,
        shop,
        imageUrls: uploadedImageUrl,
      },
      {
        onSuccess: () => {
          goNext();
        },
      }
    );
  };

  // 카테고리 & 서브카테고리 한글 변환 (디스플레이용)
  const categoryKorean = categoryEnum ? (categoryCodeToName(categoryEnum) ?? category) : category;
  const subCategoriesKorean = categoryEnum
    ? subCategories.map((sub) => subCategoryCodeToName(categoryEnum, sub)).join('/')
    : subCategories.join('/');

  // 시술 위치 표시
  const locationDisplay = branchName ? `${branchName}` : shopName;

  // 정보 항목들
  const infoItems = [
    { label: '예약일', value: selectedDate ? formatDate(selectedDate) : '-' },
    { label: '예약시간', value: selectedTime ? formatTime(selectedTime) : '-' },
    { label: '디자이너명', value: `${designerName} 디자이너` },
    { label: '시술위치', value: `${locationDisplay} · ${shopName}` },
    { label: '시술내용', value: `${categoryKorean} · ${subCategoriesKorean}` },
  ];

  // 데이터 유효성 검사 (handleReservation과 동일한 조건)
  const isValid = selectedDate && selectedTime && uploadedImageUrl && categoryEnum;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ReservationHeader onBack={goPrev} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col px-4 pt-1">
        {/* 스텝 정보 */}
        <div className="flex flex-col gap-2">
          <p className="text-head-3 leading-140 font-normal tracking-[-0.4px] text-gray-900">
            4/4
          </p>
          <h1 className="text-head-2-semibold text-gray-900">예약 사항을 확인해주세요.</h1>
        </div>

        {/* 안내 문구 */}
        <p className="mt-2 text-body-2-medium text-gray-600">
          예약 일정 기준 3일 전까지만 취소가 가능합니다.
        </p>

        {/* 정보 리스트 */}
        <div className="relative mt-6 flex flex-col gap-3">
          {/* 세로선 - 첫번째 원 중심에서 마지막 원 중심까지 (점선) */}
          <div className="absolute left-[11px] top-[28px] h-[260px] w-0 border-l border-dashed border-gray-500" />

          {infoItems.map((item, index) => (
            <div key={item.label} className="flex items-center gap-4">
              {/* 번호 원 */}
              <div className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-500">
                <span className="text-body-2-medium text-white">{index + 1}</span>
              </div>

              {/* 정보 카드 */}
              <div className="flex h-14 flex-1 items-center gap-4 rounded-lg border border-gray-400 p-4">
                <span className="w-[68px] shrink-0 text-body-2-semibold text-gray-500">
                  {item.label}
                </span>
                <span className="text-body-1-medium text-gray-900">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={handleReservation}
          disabled={!isValid || isPending}
          className={`text-body-1-semibold h-14 w-full rounded-full transition-colors ${
            isValid && !isPending
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-600'
          }`}
        >
          {isPending ? '예약 중...' : '완료'}
        </button>
      </div>
    </div>
  );
}
