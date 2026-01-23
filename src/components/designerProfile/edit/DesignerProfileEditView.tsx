'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import DesignerProfileEditHero from '@/src/components/designerProfile/edit/DesignerProfileEditHero';
import DesignerProfileEditRecruitments from '@/src/components/designerProfile/edit/DesignerProfileEditRecruitments';
import DesignerProfileEditPortfolio from '@/src/components/designerProfile/edit/DesignerProfileEditPortfolio';
import { ConfirmModal } from '@/src/components/common';
import { AddressInput } from '@/src/components/signup';
import { uploadProfileImage } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { useDeleteModal } from '@/src/hooks/custom/myRecruitment';
import { useDeleteRecruitment } from '@/src/hooks/queries/myRecruitment';
import { useUpdateMyDesignerProfile } from '@/src/hooks/queries/profile';
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
  profileImageUrl: string;
}

export default function DesignerProfileEditView({
  profile,
  openRecruitments,
  portfolioImages,
  onBack,
}: DesignerProfileEditViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string | null>(null);
  const [profileImageVersion, setProfileImageVersion] = useState<number>(0);
  const [form, setForm] = useState<DesignerProfileEditFormState>({
    nickname: profile.nickname,
    intro: profile.intro,
    shop: profile.shop,
    addressLine1: profile.address.line1,
    addressLine2: profile.address.line2,
    profileImageUrl: profile.profileImageUrl,
  });
  const [recruitments, setRecruitments] = useState(openRecruitments);
  const updateProfileMutation = useUpdateMyDesignerProfile();
  const { isOpen: deleteModalOpen, selectedId: selectedRecruitmentId, openModal, closeModal } = useDeleteModal<number>();
  const { mutate: deleteRecruitment, isPending: isDeleting } = useDeleteRecruitment();

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

  const handleAddressSearch = (address: string) => {
    setForm((prev) => ({ ...prev, addressLine1: address }));
  };

  const handleDetailAddressChange = (value: string) => {
    setForm((prev) => ({ ...prev, addressLine2: value }));
  };

  const handleEditImage = () => {
    if (isUploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    setIsUploadingImage(true);
    const previousImageUrl = form.profileImageUrl;
    const localPreviewUrl = URL.createObjectURL(file);
    setProfileImagePreviewUrl(localPreviewUrl);
    try {
      const imageUrl = await uploadProfileImage(file);
      setForm((prev) => ({ ...prev, profileImageUrl: imageUrl }));
      setProfileImagePreviewUrl(null);
      setProfileImageVersion(Date.now());
    } catch {
      setForm((prev) => ({ ...prev, profileImageUrl: previousImageUrl }));
      setProfileImagePreviewUrl(null);
      showToast('이미지 업로드에 실패했습니다.');
    }
    setIsUploadingImage(false);
  };

  useEffect(() => {
    if (!profileImagePreviewUrl?.startsWith('blob:')) return;
    return () => {
      URL.revokeObjectURL(profileImagePreviewUrl);
    };
  }, [profileImagePreviewUrl]);

  const addressLine = [form.addressLine1, form.addressLine2].filter(Boolean).join(' ');

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        nickname: form.nickname,
        intro: form.intro,
        shop: form.shop,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        profileImageUrl: form.profileImageUrl,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleRecruitmentEdit = (recruitmentId: number) => {
    router.push(`/myRecruitment/${recruitmentId}/edit`);
  };

  const handleRecruitmentDeleteConfirm = () => {
    if (!selectedRecruitmentId) return;
    const previousRecruitments = recruitments;
    setRecruitments((prev) => prev.filter((item) => item.recruitmentId !== selectedRecruitmentId));
    deleteRecruitment(selectedRecruitmentId, {
      onSuccess: closeModal,
      onError: () => {
        setRecruitments(previousRecruitments);
        closeModal();
      },
    });
  };

  const resolvedProfileImageUrl = (() => {
    if (profileImagePreviewUrl) return profileImagePreviewUrl;
    if (!profileImageVersion) return form.profileImageUrl;
    const separator = form.profileImageUrl.includes('?') ? '&' : '?';
    return `${form.profileImageUrl}${separator}v=${profileImageVersion}`;
  })();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <DesignerProfileEditHero
        profileImageUrl={resolvedProfileImageUrl}
        nickname={form.nickname}
        onBack={handleBack}
        onEditImage={handleEditImage}
      />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

      <section className="px-4 pt-4 pb-6">
        {isEditing ? (
          <div className="rounded-2xl bg-white px-4 py-4">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-body-2-semibold text-gray-900">이름</label>
                <input
                  value={form.nickname}
                  onChange={handleChange('nickname')}
                  className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-2-semibold text-gray-900">한 줄 소개</label>
                <textarea
                  value={form.intro}
                  onChange={handleChange('intro')}
                  className="text-body-2-medium min-h-[120px] resize-none rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-2-semibold text-gray-900">매장 이름</label>
                <input
                  value={form.shop}
                  onChange={handleChange('shop')}
                  className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 focus:outline-none"
                />
              </div>

              <AddressInput
                address={form.addressLine1}
                detailAddress={form.addressLine2}
                onAddressSearch={handleAddressSearch}
                onDetailAddressChange={handleDetailAddressChange}
                labelClassName="text-body-2-semibold text-gray-900"
                inputClassName="text-body-2-medium w-full cursor-pointer rounded-xl bg-gray-100 px-4 py-3.5 pr-10 text-gray-900 placeholder:text-gray-600 focus:outline-none"
                detailInputClassName="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="text-body-1-semibold mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white"
            >
              저장
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-4 py-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">이름</span>
                <span className="text-body-2-medium text-gray-900">{form.nickname}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">한 줄 소개</span>
                <p className="text-body-2-medium whitespace-pre-line text-gray-900">{form.intro}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">매장 이름</span>
                <span className="text-body-2-medium text-gray-900">{form.shop}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-body-2-semibold text-gray-900">매장 주소</span>
                <span className="text-body-2-medium text-gray-900">{addressLine}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-body-1-semibold mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-gray-400 text-gray-900"
            >
              수정하기
            </button>
          </div>
        )}
      </section>

      <section className="px-4">
        <DesignerProfileEditRecruitments
          openRecruitments={recruitments}
          onEdit={handleRecruitmentEdit}
          onDelete={openModal}
          onViewAll={() => router.push('/myRecruitment')}
        />
      </section>

      <section className="px-4 pt-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <DesignerProfileEditPortfolio images={portfolioImages} />
      </section>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeModal}
        onConfirm={handleRecruitmentDeleteConfirm}
        message="모집글을 삭제하시겠습니까?"
        confirmText="삭제"
        isLoading={isDeleting}
      />
    </div>
  );
}
