'use client';

import LocationIcon from '@/public/icons/reservation/location.svg';

interface ReservationStepInfoProps {
  currentStep: number;
  totalSteps: number;
  /** 샵 이름 (예: "아트시월") */
  shopName: string;
  /** 샵 주소 (예: "서울 서대문구 창천동 57-13") */
  shopAddress: string;
  /** 디자이너 이름 (예: "시월") */
  designerName: string;
}

// 주소에서 구 이름 추출 (예: "서울 서대문구 창천동 57-13" → "서대문구")
function extractDistrict(address: string): string {
  const parts = address.split(' ');
  const district = parts.find((part) => part.endsWith('구'));
  return district || parts[1] || '';
}

/**
 * 예약 스텝 정보 컴포넌트
 * - 스텝 표시 (1/4)
 * - 제목 (샵 이름 포함)
 * - 위치 정보 (location 아이콘 + 샵/디자이너 정보)
 */
export default function ReservationStepInfo({
  currentStep,
  totalSteps,
  shopName,
  shopAddress,
  designerName,
}: ReservationStepInfoProps) {
  // 주소에서 구 이름 추출
  const district = extractDistrict(shopAddress);
  // 위치 텍스트 조합: "서대문구 아트시월 시월 디자이너"
  const locationText = district
    ? `${district} ${shopName} ${designerName} 디자이너`
    : `${shopName} ${designerName} 디자이너`;

  return (
    <div className="flex flex-col gap-2">
      {/* 스텝 표시 */}
      <p className="text-[20px] leading-[1.4] font-normal tracking-[-0.4px]">
        <span className="text-gray-900">{currentStep}</span>
        <span className="text-gray-600">/{totalSteps}</span>
      </p>

      {/* 제목 */}
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-head-2-semibold text-gray-900">
          {shopName}에 방문할
          <br />
          방문일과 시간을 선택하세요
        </h1>

        {/* 위치 정보 */}
        <div className="flex h-[21px] items-center gap-1">
          <LocationIcon className="size-5 shrink-0 text-gray-950" />
          <p className="text-body-2-medium leading-[1.5] text-gray-700">
            <span className="font-semibold text-purple-500">{locationText}</span>
            <span>의 예약 진행 중이에요</span>
          </p>
        </div>
      </div>
    </div>
  );
}
