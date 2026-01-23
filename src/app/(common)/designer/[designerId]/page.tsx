'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import DesignerProfileSkeleton from '@/src/components/designerProfile/DesignerProfileSkeleton';
import DesignerProfileView from '@/src/components/designerProfile/DesignerProfileView';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { usePublicDesignerProfile } from '@/src/hooks/queries/profile';
import { mockPortfolioImages } from '@/src/mocks/profile/designerProfile';

interface PageProps {
  params: Promise<{ designerId: string }>;
}

export default function DesignerProfilePage({ params }: PageProps) {
  const { designerId } = use(params);
  const numericDesignerId = Number(designerId);
  const { role, isLoggedIn, authReady } = useAuthReady();
  const showActionBar = authReady && (!isLoggedIn || role === 'model');
  const validDesignerId = Number.isNaN(numericDesignerId) ? null : numericDesignerId;
  const { data, isLoading, isError } = usePublicDesignerProfile({
    designerId: validDesignerId,
    enabled: validDesignerId !== null,
  });

  if (validDesignerId === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-1-medium text-gray-600">잘못된 디자이너 ID입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return <DesignerProfileSkeleton showActionBar={showActionBar} />;
  }

  if (isError || !data?.result) {
    return notFound();
  }

  const profile = data.result.profile;
  const openRecruitments = data.result.openRecruitments;

  return (
    <DesignerProfileView
      profile={profile}
      openRecruitments={openRecruitments}
      portfolioImages={mockPortfolioImages}
      actionType="share"
      showActionBar={showActionBar}
    />
  );
}
