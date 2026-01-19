'use client';

import DesignerProfileView from '@/src/components/designerProfile/DesignerProfileView';
import { getMockDesignerProfile, mockPortfolioImages } from '@/src/mocks/profile/designerProfile';

export default function DesignerMyProfilePage() {
  const mockProfile = getMockDesignerProfile(1);

  return (
    <DesignerProfileView
      profile={mockProfile.profile}
      openRecruitments={mockProfile.openRecruitments}
      portfolioImages={mockPortfolioImages}
      actionType="edit"
    />
  );
}
