'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/arrow-left.svg';
import DesignerProfileEditPortfolio from '@/src/components/designerProfile/edit/DesignerProfileEditPortfolio';
import { useInfiniteScroll } from '@/src/hooks/common/useInfiniteScroll';
import { useDeletePortfolio, useDesignerPortfolios } from '@/src/hooks/queries';

export default function PortfolioManagePage() {
  const router = useRouter();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useDesignerPortfolios({
    size: 12,
  });
  const { mutate: deletePortfolio } = useDeletePortfolio();

  const portfolioItems = useMemo(() => data?.pages.flatMap((page) => page.result.items) ?? [], [data]);
  const portfolioImages = useMemo(() => portfolioItems.map((item) => item.thumbnail), [portfolioItems]);
  const { loadMoreRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  const handleAddPortfolio = () => {
    router.push('/mypage/portfolio/create');
  };

  const handleEditPortfolio = (id: number) => {
    router.push(`/mypage/portfolio/${id}/edit`);
  };

  const handleEditImage = (index: number) => {
    const selected = portfolioItems[index];
    if (!selected) return;
    handleEditPortfolio(selected.portfolioId);
  };

  const handleDeleteImage = (index: number) => {
    const selected = portfolioItems[index];
    if (!selected) return;
    deletePortfolio(selected.portfolioId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* 헤더 */}
      <header className="flex h-13 items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.push('/mypage')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <LeftArrowIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">포트폴리오 관리</h1>
        <div className="size-6" />
      </header>

      <div className="flex flex-1 flex-col pb-[calc(88px+env(safe-area-inset-bottom))]">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-body-1-medium text-gray-700">포트폴리오를 불러오는 중입니다.</p>
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-body-1-medium text-gray-700">포트폴리오 목록을 불러오지 못했습니다.</p>
          </div>
        ) : portfolioItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-body-1-medium text-gray-700">등록된 포트폴리오가 없습니다.</p>
          </div>
        ) : (
          <>
            <DesignerProfileEditPortfolio
              images={portfolioImages}
              onEditImage={handleEditImage}
              onDeleteImage={handleDeleteImage}
              title="내 포트폴리오"
              gridClassName="relative mt-4 grid grid-cols-3 gap-2.5"
            />
            <div ref={loadMoreRef} className="h-px w-full" aria-hidden />
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <p className="text-body-2-medium text-gray-600">포트폴리오를 더 불러오는 중입니다.</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-white px-4 py-3 sm:w-[375px]">
        <button
          type="button"
          onClick={handleAddPortfolio}
          className="text-body-1-semibold flex w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 py-4 text-white"
        >
          신규 포트폴리오 작성하기
        </button>
      </div>
    </div>
  );
}
