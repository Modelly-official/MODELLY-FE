'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { PendingReservationListItem } from '@/src/components/designerHome';
import { usePendingReservations } from '@/src/hooks/queries/designerHome';
import { useToast } from '@/src/hooks/common/useToast';

export default function PendingReservationsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, isError } = usePendingReservations();

  useEffect(() => {
    if (isError) {
      showToast('데이터를 불러오지 못했습니다');
    }
  }, [isError, showToast]);

  const items = data?.result?.reservations ?? [];
  const totalCount = data?.result?.totalCount ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* 헤더 */}
      <header className="flex h-[52px] items-center justify-between px-4">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="size-6 text-black" />
        </button>
        <h1 className="text-head-4-medium text-black">예약 신청</h1>
        {/* 우측 여백 맞춤용 */}
        <div className="size-6" />
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 px-4 pt-4">
        {/* 서브 타이틀 */}
        <p className="text-body-2-medium text-gray-700">신규 예약 신청 ({totalCount})</p>

        {/* 리스트 */}
        <div className="mt-[10px] flex flex-col gap-4">
          {isLoading ? (
            <>
              <div className="animate-skeleton h-[88px] rounded-[12px] bg-gray-300" />
              <div className="animate-skeleton h-[88px] rounded-[12px] bg-gray-300" />
            </>
          ) : items.length > 0 ? (
            items.map((item) => (
              <PendingReservationListItem key={item.reservationId} item={item} />
            ))
          ) : (
            <p className="text-body-2-medium text-gray-700">새로운 예약 신청이 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
}
