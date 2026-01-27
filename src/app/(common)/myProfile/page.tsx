'use client';

import { useMemo } from 'react';
import DesignerProfileSkeleton from '@/src/components/designerProfile/DesignerProfileSkeleton';
import DesignerProfileView from '@/src/components/designerProfile/DesignerProfileView';
import { useInfiniteScroll } from '@/src/hooks/common/useInfiniteScroll';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useMyDesignerProfile } from '@/src/hooks/queries/profile';
import { useDesignerPortfolios } from '@/src/hooks/queries/portfolio';

export default function DesignerMyProfilePage() {
  const { authReady, isLoggedIn } = useAuthReady();
  const { data, isLoading, isError } = useMyDesignerProfile({
    enabled: authReady && isLoggedIn,
  });
  const {
    data: portfolioData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDesignerPortfolios({
    size: 12,
    enabled: authReady && isLoggedIn,
  });

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const portfolioItems = useMemo(
    () => portfolioData?.pages.flatMap((page) => page.result.items) ?? [],
    [portfolioData]
  );
  const portfolioTotalCount = portfolioData?.pages?.[0]?.result.totalCount ?? portfolioItems.length;

  if (!authReady || isLoading) {
    return <DesignerProfileSkeleton />;
  }

  if (isError || !data?.result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-1-medium text-gray-600">프로필 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <DesignerProfileView
        profile={data.result.profile}
        openRecruitments={data.result.openRecruitments}
        portfolioItems={portfolioItems}
        portfolioTotalCount={portfolioTotalCount}
        actionType="edit"
      />
      <div ref={loadMoreRef} className="h-px w-full" aria-hidden />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-2">
          <p className="text-body-2-medium text-gray-600">포트폴리오를 더 불러오는 중입니다.</p>
        </div>
      )}
    </>
  );
}
