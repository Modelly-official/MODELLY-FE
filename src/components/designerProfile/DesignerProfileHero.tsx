'use client';

import Image from 'next/image';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import DesignerProfileHeader from '@/src/components/designerProfile/DesignerProfileHeader';

interface DesignerProfileHeroProps {
  profileImageUrl: string;
  nickname: string;
  shop: string;
  addressLine: string;
  actionType?: 'edit' | 'share' | 'none';
  onBack: () => void;
  onAction?: () => void;
}

export default function DesignerProfileHero({
  profileImageUrl,
  nickname,
  shop,
  addressLine,
  actionType = 'none',
  onBack,
  onAction,
}: DesignerProfileHeroProps) {
  return (
    <section className="relative h-[374px] w-full overflow-hidden rounded-b-[20px]">
      {profileImageUrl ? (
        <Image
          src={profileImageUrl}
          alt={`${nickname} 디자이너 프로필`}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
          <ProfileIcon className="size-60 text-gray-500" />
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,var(--color-black)_100%)]" />

      <DesignerProfileHeader actionType={actionType} onBack={onBack} onAction={onAction} />

      <div className="absolute bottom-0 z-10 w-full gap-1 px-5 pb-5 text-white">
        <h1 className="text-head-1-semibold">{nickname} 디자이너</h1>
        <div className="flex flex-col gap-1 text-white">
          <div className="flex items-center gap-1">
            <span className="inline-flex">
              <Image src="/icons/common/location-white.svg" alt="위치" width={12} height={14} />
            </span>
            <span className="text-body-2-medium">{shop}</span>
          </div>
          <span className="text-body-2-medium text-white">{addressLine}</span>
        </div>
      </div>
    </section>
  );
}
