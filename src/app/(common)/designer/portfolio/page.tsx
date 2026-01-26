'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ArrowLeftIcon from '@/public/icons/portfolio/straigh-arrow-left.svg';
import ArrowRightIcon from '@/public/icons/portfolio/straight-arrow-right.svg';
import LeftArrowIcon from '@/public/icons/common/arrow-left.svg';
import { getPublicPortfolioDetail } from '@/src/apis';
import { usePublicDesignerPortfolios } from '@/src/hooks/queries/portfolio';
import { portfolioKeys } from '@/src/hooks/queries/portfolio/useDesignerPortfolios';
import { getCategoryLabel } from '@/src/constants/explore';
import type { ApiResponse, PublicPortfolioDetail } from '@/src/types';

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  subCategoryList: string[];
  imageUrl: string;
};

export default function PortfolioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designerIdParam = searchParams.get('designerId');
  const numericDesignerId = designerIdParam ? Number(designerIdParam) : NaN;
  const isValidDesignerId = Number.isFinite(numericDesignerId) && numericDesignerId > 0;
  const swiperRef = useRef<SwiperType | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeIndex, setActiveIndex] = useState(0);

  const listParams = useMemo(() => ({ size: 12 }), []);
  const { data: listData, isLoading: isListLoading, isError: isListError } =
    usePublicDesignerPortfolios({
      designerId: isValidDesignerId ? numericDesignerId : null,
      params: listParams,
      enabled: isValidDesignerId,
    });

  const listItems = listData?.result.items ?? [];

  const detailQueries = useQueries({
    queries: listItems.map((item) => ({
      queryKey: portfolioKeys.publicDetail(item.portfolioId),
      queryFn: () => getPublicPortfolioDetail(item.portfolioId),
      enabled: listItems.length > 0,
      staleTime: 1000 * 60 * 2,
    })),
  }) as UseQueryResult<ApiResponse<PublicPortfolioDetail>, Error>[];

  const portfolioItems = useMemo<PortfolioItem[]>(
    () =>
      listItems.map((item, index) => {
        const detail = detailQueries[index]?.data?.result;
        const subCategoryList = detail?.subCategoryList ?? [];
        return {
          id: item.portfolioId,
          title: detail?.title ?? '',
          description: detail?.content ?? '',
          subCategoryList,
          imageUrl: detail?.imageList?.[0] ?? item.thumbnail,
        };
      }),
    [listItems, detailQueries]
  );

  const categoryOptions = useMemo(() => {
    const codes = new Set<string>();
    portfolioItems.forEach((item) => {
      item.subCategoryList.forEach((code) => codes.add(code));
    });
    const options = Array.from(codes).map((code) => ({
      id: code,
      label: getCategoryLabel(code),
    }));
    return [{ id: 'ALL', label: '전체' }, ...options];
  }, [portfolioItems]);

  const activeCategory =
    selectedCategory === 'ALL' || categoryOptions.some((option) => option.id === selectedCategory)
      ? selectedCategory
      : 'ALL';

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') return portfolioItems;
    return portfolioItems.filter((item) => item.subCategoryList.includes(activeCategory));
  }, [activeCategory, portfolioItems]);

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    setSelectedCategory(category);
    setActiveIndex(0);
  };

  const totalCount = filteredItems.length;
  const currentItem = filteredItems[activeIndex] ?? filteredItems[0];
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < totalCount - 1;

  return (
    <div className="min-h-screen bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <LeftArrowIcon className="size-6" />
        </button>
        <h1 className="text-head-3-medium text-center text-black">포트폴리오</h1>
        <div className="size-6" />
      </header>

      <div className="flex flex-1 flex-col gap-12 px-4">
        {/* 카테고리 필터 */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {categoryOptions.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[999px] px-3.5 py-1.5 transition-colors ${
                  isActive
                    ? 'text-body-2-medium bg-gray-900 text-white'
                    : 'text-body-2-regular border border-gray-200 bg-white text-gray-700'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-1 flex-col items-center">
          {!isValidDesignerId ? (
            <div className="flex w-full flex-1 items-center justify-center py-20">
              <p className="text-body-2-medium text-gray-500">디자이너 정보를 찾을 수 없습니다.</p>
            </div>
          ) : isListLoading ? (
            <div className="flex w-full flex-1 items-center justify-center py-20">
              <p className="text-body-2-medium text-gray-500">포트폴리오를 불러오는 중입니다.</p>
            </div>
          ) : isListError ? (
            <div className="flex w-full flex-1 items-center justify-center py-20">
              <p className="text-body-2-medium text-gray-500">포트폴리오를 불러오지 못했습니다.</p>
            </div>
          ) : totalCount === 0 ? (
            <div className="flex w-full flex-1 items-center justify-center py-20">
              <p className="text-body-2-medium text-gray-500">해당 카테고리의 포트폴리오가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="max-w-[300px]">
                <Swiper
                  key={selectedCategory}
                  effect="cards"
                  grabCursor
                  modules={[EffectCards, Pagination]}
                  pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100 !rounded-full',
                    bulletActiveClass: '!bg-gray-900 !w-5',
                  }}
                  cardsEffect={{
                    perSlideOffset: 12,
                    perSlideRotate: 2,
                    slideShadows: false,
                  }}
                  className="portfolio-swiper h-[420px]"
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    setActiveIndex(swiper.activeIndex);
                  }}
                >
                  {filteredItems.map((item) => (
                    <SwiperSlide key={item.id} className="flex! items-center justify-center">
                      <div className="relative h-96 w-[288px] overflow-hidden rounded-[20px] bg-gray-100 shadow-2xs">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 384px) 288px, 384px"
                          className="object-cover"
                          priority={item.id === filteredItems[0]?.id}
                        />
                        <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="mt-5 text-center">
                <h2 className="text-head-2-semibold text-gray-900">{currentItem?.title}</h2>
                <p className="text-body-1-medium mt-2 text-gray-800">{currentItem?.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  disabled={!canGoPrev}
                  className={`flex size-10 items-center justify-center rounded-full border border-gray-200 bg-gray-200 transition-opacity ${
                    canGoPrev ? 'opacity-100' : 'opacity-40'
                  }`}
                  aria-label="이전 슬라이드"
                >
                  <ArrowLeftIcon className="size-6 cursor-pointer" />
                </button>
                <div>
                  <span className="text-body-1-semibold text-purple-600">{activeIndex + 1}</span>
                  <span>/{totalCount}</span>
                </div>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  disabled={!canGoNext}
                  className={`flex size-10 items-center justify-center rounded-full border border-gray-200 bg-gray-200 transition-opacity ${
                    canGoNext ? 'opacity-100' : 'opacity-40'
                  }`}
                  aria-label="다음 슬라이드"
                >
                  <ArrowRightIcon className="size-6 cursor-pointer" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .portfolio-swiper {
          padding-bottom: 12px;
        }
        .portfolio-swiper .swiper-wrapper {
          align-items: center;
        }
        .portfolio-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .portfolio-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          margin: 0 3px !important;
          transition: width 0.2s ease;
        }
      `}</style>
    </div>
  );
}
