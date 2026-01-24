'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/src/components/common';
import ChatCategoryChips from '@/src/components/chat/chatlist/ChatCategoryChips';
import RecruitmentCard from '@/src/components/explore/Cards/RecruitmentCard';
import DesignerCard from '@/src/components/explore/Cards/DesignerCard';
import BellIcon from '@/public/icons/designer-home/bell.svg';
import MoandiLogo from '@/public/icons/model-home/moandiLogo.svg';
import LocationIcon from '@/public/icons/common/location-current.svg';
import { ReservationCard } from './ReservationCard';
import { TopRecruitmentCard } from './TopRecruitmentCard';
import {
  MOCK_NEARBY_RECRUITMENTS,
  MOCK_POPULAR_DESIGNERS,
  MOCK_RESERVATIONS,
  MOCK_TOP_RECRUITMENTS,
  MOCK_USER,
} from '@/src/mocks/modelHome/homeMock';
import type { HomeCategory } from '@/src/types/modelHome/modelHome';

export function ModelHomeContent() {
  const router = useRouter();
  const [nearbyCategory, setNearbyCategory] = useState<HomeCategory>('ALL');
  const [topCategory, setTopCategory] = useState<HomeCategory>('ALL');
  const [designerCategory, setDesignerCategory] = useState<HomeCategory>('ALL');
  const categoryIndicators: HomeCategory[] = ['ALL', 'HAIR', 'NAIL', 'TATTOO', 'EYELASH'];

  const reservation = MOCK_RESERVATIONS[0] ?? null;
  const hasReservation = Boolean(reservation);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="rounded-b-3xl bg-gray-200 pb-7">
          {/* 헤더 */}
          <header className="flex h-13 items-center justify-between px-4">
            <MoandiLogo />
            <button type="button" aria-label="알림" onClick={() => router.push('/notification')} className="relative">
              <BellIcon className="size-6 cursor-pointer" />
            </button>
          </header>

          {/* 프로필 */}
          <div className="flex items-start justify-between px-4 pt-2 pb-5">
            <div className="max-w-60">
              <h1 className="text-head-3-semibold text-gray-900">{MOCK_USER.name}님,</h1>
              <p className="text-head-3-semibold text-gray-900">
                {hasReservation ? '예약 내역을 확인해보세요' : '나에게 딱 맞는 디자이너를 찾아보세요!'}
              </p>
            </div>
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-gray-300">
              <Image src={MOCK_USER.profileImageUrl} alt="프로필" fill sizes="64px" className="object-cover" />
            </div>
          </div>

          {/* 예약 카드 */}
          <section className="px-4">
            <ReservationCard reservation={reservation} />
          </section>
        </div>

        <div className="flex flex-col gap-8 bg-white pb-[calc(87px+env(safe-area-inset-bottom)+16px)]">
          {/* 내 주위 모집글 */}
          <section className="mt-8">
            <div className="px-4">
              <div className="text-body-2-semibold flex items-center gap-1 text-purple-500">
                <LocationIcon className="translate-y-px text-purple-500" />
                <span className="leading-none">마포구 상수동</span>
              </div>
              <h2 className="text-head-4-semibold mt-2 text-gray-900">내 주위 모집글</h2>
              <div className="-mx-4 mt-1">
                <ChatCategoryChips
                  selectedCategory={nearbyCategory}
                  onChange={(category) => setNearbyCategory(category as HomeCategory)}
                />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {MOCK_NEARBY_RECRUITMENTS.map((item, index) => (
                <RecruitmentCard key={item.recruitmentId} recruitment={item} isLeftColumn={index % 2 === 0} />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5">
              {categoryIndicators.map((category) => (
                <span
                  key={category}
                  className={`h-1.5 rounded-full ${nearbyCategory === category ? 'w-5 bg-gray-900' : 'w-1.5 bg-gray-400'}`}
                />
              ))}
            </div>
          </section>

          {/* 실시간 인기 TOP 모집글 */}
          <section>
            <div className="px-4">
              <h2 className="text-body-1-semibold text-gray-900">실시간 인기 TOP 모집글</h2>
              <div className="-mx-4 mt-3">
                <ChatCategoryChips
                  selectedCategory={topCategory}
                  onChange={(category) => setTopCategory(category as HomeCategory)}
                />
              </div>
            </div>
            <div className="mt-4 px-4">
              <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
                {MOCK_TOP_RECRUITMENTS.map((item) => (
                  <div key={item.recruitmentId} className="w-[260px] shrink-0">
                    <TopRecruitmentCard recruitment={item} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                {MOCK_TOP_RECRUITMENTS.map((item, index) => (
                  <span
                    key={item.recruitmentId}
                    className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-gray-800' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 시술별 인기 디자이너 */}
          <section>
            <div className="px-4">
              <h2 className="text-body-1-semibold text-gray-900">시술별 인기 디자이너</h2>
              <div className="-mx-4 mt-3">
                <ChatCategoryChips
                  selectedCategory={designerCategory}
                  onChange={(category) => setDesignerCategory(category as HomeCategory)}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 px-4">
              {MOCK_POPULAR_DESIGNERS.map((item) => (
                <div key={item.designerId} className="rounded-2xl bg-white px-4 py-3">
                  <DesignerCard designer={item} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
