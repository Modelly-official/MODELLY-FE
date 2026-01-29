'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper/types';
import 'swiper/css';
import { BottomNav, Skeleton } from '@/src/components/common';
import ChatCategoryChips from '@/src/components/chat/chatlist/ChatCategoryChips';
import RecruitmentCard from '@/src/components/explore/Cards/RecruitmentCard';
import DesignerCard from '@/src/components/explore/Cards/DesignerCard';
import RecruitmentCardSkeleton from '@/src/components/explore/Skeleton/RecruitmentCardSkeleton';
import DesignerCardSkeleton from '@/src/components/explore/Skeleton/DesignerCardSkeleton';
import { useModelHomeSummary } from '@/src/hooks/custom/modelHome/useModelHomeSummary';
import { useNearbyRecruitments } from '@/src/hooks/custom/modelHome/useNearbyRecruitments';
import { usePopularDesigners } from '@/src/hooks/custom/modelHome/usePopularDesigners';
import { useTopRecruitments } from '@/src/hooks/custom/modelHome/useTopRecruitments';
import { useToggleDesignerLike, useToggleRecruitmentLike } from '@/src/hooks/queries/likes';
import BellIcon from '@/public/icons/designer-home/bell.svg';
import MoandiLogo from '@/public/icons/model-home/moandiLogo.svg';
import LocationIcon from '@/public/icons/common/location-current.svg';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import { ReservationCard } from './ReservationCard';
import { TopRecruitmentCard } from './TopRecruitmentCard';
import type { HomeCategory } from '@/src/types/modelHome';
import type { RecruitmentListItem } from '@/src/types';

export function ModelHomeContent() {
  const router = useRouter();
  const [nearbyCategory, setNearbyCategory] = useState<HomeCategory>('ALL');
  const [topCategory, setTopCategory] = useState<HomeCategory>('ALL');
  const [designerCategory, setDesignerCategory] = useState<HomeCategory>('HAIR');
  const [nearbyActiveIndex, setNearbyActiveIndex] = useState(0);
  const designerCategories: HomeCategory[] = ['HAIR', 'NAIL', 'TATTOO', 'EYELASH'];
  const [topActiveIndex, setTopActiveIndex] = useState(0);

  const { authReady, isLoggedIn, isSummaryLoading, modelName, profileImageUrl, reservationSummary, hasReservation } =
    useModelHomeSummary();
  const { items: topRecruitments, isLoading: isTopLoading } = useTopRecruitments(topCategory);
  const {
    items: nearbyRecruitments,
    isLoading: isNearbyLoading,
    isLocationLoading,
    locationLabel,
    showLocationCta,
    requestLocation,
    activeLocation,
  } = useNearbyRecruitments(nearbyCategory);
  const { items: popularDesigners, isLoading: isPopularLoading } = usePopularDesigners(
    designerCategory,
    activeLocation,
    isLocationLoading,
  );
  const { mutate: toggleRecruitmentLike } = useToggleRecruitmentLike();
  const { mutate: toggleDesignerLike } = useToggleDesignerLike();

  const nearbySwiperRef = useRef<SwiperInstance | null>(null);
  const topSwiperRef = useRef<SwiperInstance | null>(null);

  const nearbySlides = useMemo(() => {
    const slides: Array<RecruitmentListItem[]> = [];
    for (let i = 0; i < nearbyRecruitments.length; i += 2) {
      slides.push(nearbyRecruitments.slice(i, i + 2));
    }
    return slides;
  }, [nearbyRecruitments]);

  const handleNearbyCategoryChange = (category: HomeCategory) => {
    setNearbyCategory(category);
    setNearbyActiveIndex(0);
    if (nearbySwiperRef.current) {
      nearbySwiperRef.current.slideTo(0, 0);
    }
  };

  const handleTopCategoryChange = (category: HomeCategory) => {
    setTopCategory(category);
    setTopActiveIndex(0);
    if (topSwiperRef.current) {
      topSwiperRef.current.slideTo(0, 0);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className={`rounded-b-3xl bg-gray-200 ${isLoggedIn || !authReady ? 'pb-7' : 'pb-5'}`}>
          {/* 헤더 */}
          <header className="flex h-13 items-center justify-between px-4">
            <MoandiLogo />
            <button type="button" aria-label="알림" onClick={() => router.push('/notification')} className="relative">
              <BellIcon className="size-6 cursor-pointer" />
            </button>
          </header>

          {!authReady ? (
            <div className="h-70.5 px-4 pt-2 pb-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton variant="text" className="h-5 w-36" />
                  <Skeleton variant="text" className="h-5 w-40" />
                </div>
                <Skeleton variant="circular" className="size-16" />
              </div>
              <Skeleton className="mt-5 h-28 rounded-xl" />
            </div>
          ) : isLoggedIn ? (
            isSummaryLoading ? (
              <div className="h-70.5 px-4 pt-2 pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton variant="text" className="h-5 w-36" />
                    <Skeleton variant="text" className="h-5 w-40" />
                  </div>
                  <Skeleton variant="circular" className="size-16" />
                </div>
                <Skeleton className="mt-5 h-28 rounded-xl" />
              </div>
            ) : (
              <>
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
                      <div className="flex size-full items-center justify-center bg-gray-100">
                        <ProfileIcon className="size-10 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 예약 카드 */}
                <section className="px-4">
                  <ReservationCard reservation={reservationSummary} />
                </section>
              </>
            )
          ) : (
            <div className="px-4 pt-2">
              <p className="text-head-3-semibold text-gray-900">
                로그인 후 원하는 공고를
                <br />
                예약해보세요
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-13 bg-white pb-[calc(87px+env(safe-area-inset-bottom)+58px)]">
          {/* 내 주위 모집글 */}
          <section className="mt-8">
            <div className="px-4">
              <div className="text-body-2-semibold flex items-center gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <LocationIcon className="translate-y-px text-purple-500" />
                  <span className="min-w-0 truncate text-purple-500">{locationLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={requestLocation}
                  className={`text-caption-1-medium shrink-0 cursor-pointer text-gray-700 underline underline-offset-2 ${
                    showLocationCta ? '' : 'pointer-events-none invisible'
                  }`}
                >
                  내 주변으로 보기
                </button>
              </div>
              <h2 className="text-head-4-semibold mt-2 text-gray-900">내 주위 모집글</h2>
              <div className="-mx-4 mt-1">
                <ChatCategoryChips
                  selectedCategory={nearbyCategory}
                  onChange={(category) => handleNearbyCategoryChange(category as HomeCategory)}
                />
              </div>
            </div>
            {isNearbyLoading ? (
              <div className="mt-2">
                <div className="flex gap-2">
                  {[0, 1].map((index) => (
                    <div key={`nearby-skeleton-${index}`} className="min-w-0 flex-1">
                      <RecruitmentCardSkeleton isLeftColumn={index % 2 === 0} />
                    </div>
                  ))}
                </div>
              </div>
            ) : nearbySlides.length > 0 ? (
              <div className="mt-2">
                <Swiper
                  spaceBetween={12}
                  slidesPerView={1}
                  onSlideChange={(swiper) => setNearbyActiveIndex(swiper.activeIndex)}
                  onSwiper={(swiper) => {
                    nearbySwiperRef.current = swiper;
                    setNearbyActiveIndex(0);
                  }}
                  className="w-full"
                >
                  {nearbySlides.map((pair, slideIndex) => (
                    <SwiperSlide key={`nearby-slide-${slideIndex}`} className="w-full!">
                      <div className="flex gap-2">
                        {pair.map((item, index) => (
                          <div key={item.recruitmentId} className="min-w-0 flex-1">
                            <RecruitmentCard
                              recruitment={item}
                              isLeftColumn={index === 0}
                              onLikeToggle={() => toggleRecruitmentLike(item.recruitmentId)}
                            />
                          </div>
                        ))}
                        {pair.length === 1 && <div className="min-w-0 flex-1" aria-hidden />}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="relative mt-5.5">
                <Swiper spaceBetween={12} slidesPerView={1} className="w-full">
                  <SwiperSlide className="w-full!">
                    <div className="invisible flex w-full gap-2">
                      {[0, 1].map((index) => (
                        <div key={`nearby-empty-${index}`} className="min-w-0 flex-1">
                          <RecruitmentCardSkeleton isLeftColumn={index % 2 === 0} />
                        </div>
                      ))}
                    </div>
                  </SwiperSlide>
                </Swiper>
                <p className="text-body-2-medium absolute inset-0 flex h-[341px] items-center justify-center px-4 text-gray-600">
                  내 주위에 모집글이 없습니다.
                </p>
              </div>
            )}
            <div className="mt-5 flex min-h-1.5 items-center justify-center gap-1.5">
              {nearbySlides.map((_, index) => (
                <span
                  key={`nearby-indicator-${index}`}
                  className={`h-1.5 rounded-full ${
                    nearbyActiveIndex === index ? 'w-5 bg-gray-900' : 'w-1.5 bg-gray-400'
                  }`}
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
                  onChange={(category) => handleTopCategoryChange(category as HomeCategory)}
                />
              </div>
            </div>
            <div className="mt-2">
              {isTopLoading ? (
                <div className="flex gap-2 px-4">
                  <div className="animate-skeleton aspect-260/286 w-[62vw] shrink-0 rounded-2xl bg-gray-200 max-[389px]:w-[241px] sm:w-[260px]" />
                  <div className="animate-skeleton aspect-260/286 w-[62vw] shrink-0 rounded-2xl bg-gray-200 max-[389px]:w-[241px] sm:w-[260px]" />
                </div>
              ) : topRecruitments.length > 0 ? (
                <>
                  <Swiper
                    spaceBetween={8}
                    slidesPerView="auto"
                    onSlideChange={(swiper) => setTopActiveIndex(swiper.activeIndex)}
                    onSwiper={(swiper) => {
                      topSwiperRef.current = swiper;
                      setTopActiveIndex(0);
                    }}
                    className="-mx-4 px-4!"
                  >
                    {topRecruitments.map((item) => (
                      <SwiperSlide key={item.recruitmentId} className="w-[62vw]! max-[389px]:w-[241px]! sm:w-[260px]!">
                        <TopRecruitmentCard recruitment={item} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              ) : (
                <div className="px-4">
                  <div className="flex items-center justify-center">
                    <div className="flex aspect-260/286 w-[62vw] items-center justify-center max-[389px]:w-[241px] sm:w-[260px]">
                      <p className="text-body-2-medium text-gray-600">표시할 모집글이 없습니다.</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-5 flex min-h-1.5 items-center justify-center gap-1.5">
                {topRecruitments.map((item, index) => (
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
                  categories={designerCategories}
                />
              </div>
            </div>
            <div className="">
              {isPopularLoading ? (
                <div className="flex flex-col">
                  {[0, 1, 2].map((index) => (
                    <div key={`popular-designer-skeleton-${index}`} className="rounded-2xl bg-white px-4 py-2">
                      <DesignerCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : popularDesigners.length > 0 ? (
                <div className="flex flex-col">
                  {popularDesigners.map((item) => (
                    <div key={item.designerId} className="rounded-2xl bg-white px-4 py-2">
                      <DesignerCard designer={item} onLikeToggle={() => toggleDesignerLike(item.designerId)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <div className="invisible flex flex-col">
                    {[0, 1, 2].map((index) => (
                      <div key={`popular-designer-empty-${index}`} className="rounded-2xl bg-white px-4 py-2">
                        <DesignerCardSkeleton />
                      </div>
                    ))}
                  </div>
                  <p className="text-body-2-medium absolute inset-0 flex items-center justify-center px-4 text-gray-500">
                    표시할 디자이너가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
