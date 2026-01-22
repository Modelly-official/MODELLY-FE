'use client';

import { use } from 'react';
import DesignerProfileView from '@/src/components/designerProfile/DesignerProfileView';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { getMockDesignerProfile, mockPortfolioImages } from '@/src/mocks/profile/designerProfile';

interface PageProps {
  params: Promise<{ designerId: string }>;
}

export default function DesignerProfilePage({ params }: PageProps) {
  const { designerId } = use(params);
  const numericDesignerId = Number(designerId);
  const { role, isLoggedIn } = useAuthReady();

  if (Number.isNaN(numericDesignerId)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-1-medium text-gray-600">잘못된 디자이너 ID입니다.</p>
      </div>
    );
  }

  const mockProfile = getMockDesignerProfile(numericDesignerId);
  const profile = mockProfile.profile;
  const openRecruitments = mockProfile.openRecruitments;
  const showActionBar = !isLoggedIn || role === 'model';

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
