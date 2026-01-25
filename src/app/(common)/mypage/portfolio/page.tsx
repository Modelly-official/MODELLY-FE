'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ArrowLeftIcon from '@/public/icons/portfolio/straigh-arrow-left.svg';
import ArrowRightIcon from '@/public/icons/portfolio/straight-arrow-right.svg';
import { mockPortfolioImages } from '@/src/mocks/profile/designerProfile';

type PortfolioCategory = 'ALL' | 'CUT' | 'PERM' | 'COLOR' | 'MAGIC';

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  category: Exclude<PortfolioCategory, 'ALL'>;
  imageUrl: string;
};

const PORTFOLIO_CATEGORIES: Array<{ id: PortfolioCategory; label: string }> = [
  { id: 'ALL', label: '전체' },
  { id: 'CUT', label: '컷트' },
  { id: 'PERM', label: '펌' },
  { id: 'COLOR', label: '염색' },
  { id: 'MAGIC', label: '매직' },
];

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: '애쉬 레이어드컷',
    description: '레이어드 컷으로 자연스러운 볼륨을 살린 스타일입니다.',
    category: 'CUT',
    imageUrl: mockPortfolioImages[0],
  },
  {
    id: 2,
    title: '시스루 뱅 컷',
    description: '가벼운 시스루 뱅으로 얼굴형을 부드럽게 표현했습니다.',
    category: 'CUT',
    imageUrl: mockPortfolioImages[1],
  },
  {
    id: 3,
    title: '내추럴 C컬 펌',
    description: '과하지 않은 C컬로 손질이 쉬운 데일리 펌입니다.',
    category: 'PERM',
    imageUrl: mockPortfolioImages[2],
  },
  {
    id: 4,
    title: '볼륨 웨이브 펌',
    description: '입체적인 웨이브로 풍성한 실루엣을 완성했습니다.',
    category: 'PERM',
    imageUrl: mockPortfolioImages[3],
  },
  {
    id: 5,
    title: '애쉬 브라운 컬러',
    description: '부드러운 애쉬 톤으로 고급스러운 무드를 연출했습니다.',
    category: 'COLOR',
    imageUrl: mockPortfolioImages[4],
  },
  {
    id: 6,
    title: '카키 브라운 염색',
    description: '차분한 카키 브라운으로 세련된 느낌을 강조했습니다.',
    category: 'COLOR',
    imageUrl: mockPortfolioImages[5],
  },
  {
    id: 7,
    title: '매직 스트레이트',
    description: '깔끔한 스트레이트 라인으로 윤기 있는 모발을 완성했습니다.',
    category: 'MAGIC',
    imageUrl: mockPortfolioImages[6],
  },
  {
    id: 8,
    title: '복구 매직',
    description: '손상모를 고려한 복구 매직으로 탄력을 살렸습니다.',
    category: 'MAGIC',
    imageUrl: mockPortfolioImages[7],
  },
  {
    id: 9,
    title: '내추럴 레이어드',
    description: '일상에 자연스럽게 어울리는 레이어드 컷입니다.',
    category: 'CUT',
    imageUrl: mockPortfolioImages[8],
  },
];

export default function PortfolioPage() {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('ALL');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category: PortfolioCategory) => {
    if (category === selectedCategory) return;
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
          onClick={() => router.push('/mypage')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-3-medium text-center text-black">포트폴리오</h1>
        <div className="size-6" />
      </header>

      <div className="flex flex-1 flex-col gap-12 px-4">
        {/* 카테고리 필터 */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {PORTFOLIO_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
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
          {totalCount === 0 ? (
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
                      <div className="relative h-96 w-[288px] overflow-hidden rounded-[20px] bg-gray-100">
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
                  <ArrowLeftIcon className="size-6" />
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
                  <ArrowRightIcon className="size-6" />
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
