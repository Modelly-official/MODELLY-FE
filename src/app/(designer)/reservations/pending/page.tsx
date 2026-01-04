'use client';

import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { PendingReservationListItem } from '@/src/components/designerHome';
import { mockPendingReservations } from '@/src/mocks/designerHome';

export default function PendingReservationsPage() {
  const router = useRouter();
  const { items, totalCount } = mockPendingReservations;

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="h-4 text-black" />
        </button>
        <h1 className="text-head-4-medium text-black">예약 신청</h1>
        {/* 우측 여백 맞춤용 */}
        <div className="size-6" />
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 px-4 pt-[8px]">
        {/* 서브 타이틀 */}
        <p className="text-body-1-medium text-gray-800">신규 예약 신청 {totalCount}개</p>

        {/* 리스트 */}
        <div className="mt-[10px] flex flex-col gap-4">
          {items.map((item) => (
            <PendingReservationListItem key={item.reservationId} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
