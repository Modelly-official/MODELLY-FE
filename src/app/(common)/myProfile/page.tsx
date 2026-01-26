'use client';

import { useMemo } from 'react';
import DesignerProfileSkeleton from '@/src/components/designerProfile/DesignerProfileSkeleton';
import DesignerProfileView from '@/src/components/designerProfile/DesignerProfileView';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useMyDesignerProfile } from '@/src/hooks/queries/profile';
import { useDesignerPortfolios } from '@/src/hooks/queries/portfolio';

export default function DesignerMyProfilePage() {
  const { authReady, isLoggedIn } = useAuthReady();
  const { data, isLoading, isError } = useMyDesignerProfile({
    enabled: authReady && isLoggedIn,
  });
  const { data: portfolioData } = useDesignerPortfolios({
    size: 12,
    enabled: authReady && isLoggedIn,
  });

  const portfolioImages = useMemo(
    () => portfolioData?.pages.flatMap((page) => page.result.items.map((item) => item.thumbnail)) ?? [],
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
    <DesignerProfileView
      profile={data.result.profile}
      openRecruitments={data.result.openRecruitments}
      portfolioImages={portfolioImages}
      actionType="edit"
    />
  );
}
