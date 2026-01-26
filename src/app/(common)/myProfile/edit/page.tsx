'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DesignerProfileEditView from '@/src/components/designerProfile/edit/DesignerProfileEditView';
import DesignerProfileSkeleton from '@/src/components/designerProfile/DesignerProfileSkeleton';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useMyDesignerProfile } from '@/src/hooks/queries/profile';
import { useDeletePortfolio, useDesignerPortfolios } from '@/src/hooks/queries/portfolio';

export default function DesignerProfileEditPage() {
  const router = useRouter();
  const { authReady, isLoggedIn } = useAuthReady();
  const { data, isLoading, isError } = useMyDesignerProfile({
    enabled: authReady && isLoggedIn,
  });
  const { data: portfolioData } = useDesignerPortfolios({
    size: 12,
    enabled: authReady && isLoggedIn,
  });
  const { mutate: deletePortfolio } = useDeletePortfolio();

  const portfolioItems = useMemo(
    () => portfolioData?.pages.flatMap((page) => page.result.items) ?? [],
    [portfolioData]
  );

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
    <DesignerProfileEditView
      profile={data.result.profile}
      openRecruitments={data.result.openRecruitments}
      portfolioItems={portfolioItems}
      onPortfolioEdit={(portfolioId) => router.push(`/mypage/portfolio/${portfolioId}/edit`)}
      onPortfolioDelete={(portfolioId) => deletePortfolio(portfolioId)}
    />
  );
}
