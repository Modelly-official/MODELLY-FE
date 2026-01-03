'use client';

import { useRecruitmentDetail } from '@/src/hooks/queries/explore';
import ReservationFunnel from './ReservationFunnel';

interface ReservationContainerProps {
  recruitmentId: number;
}

export default function ReservationContainer({ recruitmentId }: ReservationContainerProps) {
  const { data, isLoading, isError } = useRecruitmentDetail(recruitmentId);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (isError || !data?.result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-500">공고 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const { designerProfile, category, subCategories } = data.result;

  return (
    <ReservationFunnel
      recruitmentId={recruitmentId}
      shopName={designerProfile.shop}
      shopAddress={designerProfile.shopAddress}
      designerName={designerProfile.designerName}
      category={category}
      subCategories={subCategories}
    />
  );
}
