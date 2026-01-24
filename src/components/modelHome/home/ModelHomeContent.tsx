'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { BottomNav } from '@/src/components/common';
import ChatCategoryChips from '@/src/components/chat/chatlist/ChatCategoryChips';
import RecruitmentCard from '@/src/components/explore/Cards/RecruitmentCard';
import DesignerCard from '@/src/components/explore/Cards/DesignerCard';
import { useModelReservations } from '@/src/hooks/queries/reservation';
import { useModelProfile } from '@/src/hooks/queries/mypage';
import { getAccessToken } from '@/src/stores';
import { formatDateToKorean, formatTimeWithPeriod } from '@/src/utils/common';
import BellIcon from '@/public/icons/designer-home/bell.svg';
import MoandiLogo from '@/public/icons/model-home/moandiLogo.svg';
import LocationIcon from '@/public/icons/common/location-current.svg';
import ProfilePlaceholderIcon from '@/public/icons/designer-home/profile-placeholder.svg';
import { ReservationCard } from './ReservationCard';
import { TopRecruitmentCard } from './TopRecruitmentCard';
import {
  MOCK_NEARBY_RECRUITMENTS,
  MOCK_POPULAR_DESIGNERS,
  MOCK_TOP_RECRUITMENTS,
} from '@/src/mocks/modelHome/homeMock';
import type { HomeCategory, ReservationSummary } from '@/src/types/modelHome';
import type { ModelReservationItem } from '@/src/types';

function getDdayLabel(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'D-day';
  return `D-${diffDays}`;
}

export function ModelHomeContent() {
  const router = useRouter();
  const [nearbyCategory, setNearbyCategory] = useState<HomeCategory>('ALL');
  const [topCategory, setTopCategory] = useState<HomeCategory>('ALL');
  const [designerCategory, setDesignerCategory] = useState<HomeCategory>('ALL');
  const [topActiveIndex, setTopActiveIndex] = useState(0);
  const categoryIndicators: HomeCategory[] = ['ALL', 'HAIR', 'NAIL', 'TATTOO', 'EYELASH'];

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isLoggedIn = isClient && !!getAccessToken();

  const { data: profileData } = useModelProfile(isLoggedIn);
  const profile = profileData?.result ?? null;

  const modelName = profile?.nickname ?? '모델';
  const profileImageUrl = profile?.profileImageUrl ?? null;

  const reservationsQuery = useModelReservations('UPCOMING', {}, { enabled: isLoggedIn });
  const reservationItems = useMemo<ModelReservationItem[]>(() => {
    return reservationsQuery.data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [reservationsQuery.data?.pages]);

  const confirmedReservation = useMemo(() => {
    const confirmedItems = reservationItems.filter((item) => item.status === 'RESERVATION_CONFIRMED');
    if (confirmedItems.length === 0) return null;

    return [...confirmedItems].sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.startTime}:00`).getTime();
      const bTime = new Date(`${b.date}T${b.startTime}:00`).getTime();
      return aTime - bTime;
    })[0];
  }, [reservationItems]);

  const reservationSummary = useMemo<ReservationSummary | null>(() => {
    if (!confirmedReservation) return null;
    const dateLabel = formatDateToKorean(confirmedReservation.date);
    const timeLabel = formatTimeWithPeriod(confirmedReservation.startTime).replace(' ', '');
    return {
      id: confirmedReservation.reservationId,
      designerName: confirmedReservation.designerNickname,
      shop: confirmedReservation.shop,
      recruitmentTitle: confirmedReservation.recruitmentTitle,
      date: dateLabel,
      time: timeLabel,
      dday: getDdayLabel(confirmedReservation.date),
      tags: [confirmedReservation.category, ...confirmedReservation.subCategories],
    };
  }, [confirmedReservation]);

  const hasReservation = Boolean(reservationSummary);

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
              <p className="text-head-3-semibold text-gray-900">
                {hasReservation ? (
                  <>
                    {modelName}님, 예약 내역을
                    <br />
                    확인해보세요
                  </>
                ) : (
                  <>
                    {modelName}님, 나에게 딱 맞는
                    <br />
                    디자이너를 찾아보세요!
                  </>
                )}
              </p>
            </div>
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-gray-300">
              {profileImageUrl ? (
                <Image src={profileImageUrl} alt="프로필" fill sizes="64px" className="object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-gray-500">
                  <ProfilePlaceholderIcon className="size-6" />
                </div>
              )}
            </div>
          </div>

          {/* 예약 카드 */}
          <section className="px-4">
            <ReservationCard reservation={reservationSummary} />
          </section>
        </div>

        <div className="flex flex-col gap-13 bg-white pb-[calc(87px+env(safe-area-inset-bottom)+58px)]">
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
              <h2 className="text-head-4-semibold text-gray-900">실시간 인기 TOP 모집글</h2>
              <div className="-mx-4 mt-1">
                <ChatCategoryChips
                  selectedCategory={topCategory}
                  onChange={(category) => setTopCategory(category as HomeCategory)}
                />
              </div>
            </div>
            <div className="mt-2">
              <Swiper
                spaceBetween={8}
                slidesPerView="auto"
                onSlideChange={(swiper) => setTopActiveIndex(swiper.activeIndex)}
                className="-mx-4 px-4!"
              >
                {MOCK_TOP_RECRUITMENTS.map((item) => (
                  <SwiperSlide key={item.recruitmentId} className="w-[clamp(200px,62vw,640px)]!">
                    <TopRecruitmentCard recruitment={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="mt-5 flex items-center justify-center gap-1.5">
                {MOCK_TOP_RECRUITMENTS.map((item, index) => (
                  <span
                    key={item.recruitmentId}
                    className={`h-1.5 rounded-full ${
                      topActiveIndex === index ? 'w-5 bg-gray-900' : 'w-1.5 bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 시술별 인기 디자이너 */}
          <section>
            <div className="px-4">
              <h2 className="text-head-4-semibold text-gray-900">시술별 인기 디자이너</h2>
              <div className="-mx-4 mt-2">
                <ChatCategoryChips
                  selectedCategory={designerCategory}
                  onChange={(category) => setDesignerCategory(category as HomeCategory)}
                />
              </div>
            </div>
            <div className="">
              <div className="flex flex-col">
                {MOCK_POPULAR_DESIGNERS.map((item) => (
                  <div key={item.designerId} className="rounded-2xl bg-white px-4 py-2">
                    <DesignerCard designer={item} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                {categoryIndicators.map((category) => (
                  <span
                    key={category}
                    className={`h-1.5 rounded-full ${
                      designerCategory === category ? 'w-5 bg-gray-900' : 'w-1.5 bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
