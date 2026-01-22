'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DesignerProfileEditHero from '@/src/components/designerProfile/edit/DesignerProfileEditHero';
import DesignerProfileEditRecruitments from '@/src/components/designerProfile/edit/DesignerProfileEditRecruitments';
import DesignerProfileEditPortfolio from '@/src/components/designerProfile/edit/DesignerProfileEditPortfolio';
import type { DesignerProfileInfo, DesignerRecruitmentCard } from '@/src/types/profile';

interface DesignerProfileEditViewProps {
  profile: DesignerProfileInfo;
  openRecruitments: DesignerRecruitmentCard[];
  portfolioImages: string[];
  onBack?: () => void;
}

interface DesignerProfileEditFormState {
  nickname: string;
  intro: string;
  shop: string;
  addressLine1: string;
  addressLine2: string;
}

export default function DesignerProfileEditView({
  profile,
  openRecruitments,
  portfolioImages,
  onBack,
}: DesignerProfileEditViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const initialForm = useMemo(
    () => ({
      nickname: profile.nickname,
      intro: profile.intro,
      shop: profile.shop,
      addressLine1: profile.address.line1,
      addressLine2: profile.address.line2,
    }),
    [profile],
  );
  const [form, setForm] = useState<DesignerProfileEditFormState>(initialForm);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handleChange =
    (field: keyof DesignerProfileEditFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const displayForm = isEditing ? form : initialForm;
  const addressLine = [displayForm.addressLine1, displayForm.addressLine2].filter(Boolean).join(' ');
  const handleStartEdit = () => {
    setForm(initialForm);
    setIsEditing(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <DesignerProfileEditHero
        profileImageUrl={profile.profileImageUrl}
        nickname={profile.nickname}
        onBack={handleBack}
      />

      <section className="px-4 pt-4 pb-6">
        {isEditing ? (
          <div className="rounded-2xl bg-white px-4 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-body-2-semibold text-gray-900">이름</label>
                <input
                  value={form.nickname}
                  onChange={handleChange('nickname')}
                  className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-2-semibold text-gray-900">한 줄 소개</label>
                <textarea
                  value={form.intro}
                  onChange={handleChange('intro')}
                  className="text-body-2-medium min-h-[120px] resize-none rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-2-semibold text-gray-900">매장 이름</label>
                <input
                  value={form.shop}
                  onChange={handleChange('shop')}
                  className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-2-semibold text-gray-900">매장 주소</label>
                <input
                  value={form.addressLine1}
                  onChange={handleChange('addressLine1')}
                  className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900"
                />
                <input
                  value={form.addressLine2}
                  onChange={handleChange('addressLine2')}
                  className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-body-1-semibold mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white"
            >
              저장
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-4 py-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">이름</span>
                <span className="text-body-2-medium text-gray-900">{displayForm.nickname}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">한 줄 소개</span>
                <p className="text-body-2-medium whitespace-pre-line text-gray-900">{displayForm.intro}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">매장 이름</span>
                <span className="text-body-2-medium text-gray-900">{displayForm.shop}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">매장 주소</span>
                <span className="text-body-2-medium text-gray-900">{addressLine}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartEdit}
              className="text-body-1-semibold mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-gray-400 text-gray-900"
            >
              수정하기
            </button>
          </div>
        )}
      </section>

      <section className="px-4">
        <DesignerProfileEditRecruitments openRecruitments={openRecruitments} />
      </section>

      <section className="px-4 pt-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <DesignerProfileEditPortfolio images={portfolioImages} />
      </section>
    </div>
  );
}
