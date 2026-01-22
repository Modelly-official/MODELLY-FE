'use client';

import Image from 'next/image';
import DesignerProfileHeader from '@/src/components/designerProfile/DesignerProfileHeader';

interface DesignerProfileEditHeroProps {
  profileImageUrl: string;
  nickname: string;
  onBack: () => void;
  onEditImage?: () => void;
}

export default function DesignerProfileEditHero({
  profileImageUrl,
  nickname,
  onBack,
  onEditImage,
}: DesignerProfileEditHeroProps) {
  const isLocalPreview = profileImageUrl.startsWith('blob:') || profileImageUrl.startsWith('data:');

  return (
    <section className="relative h-[374px] w-full overflow-hidden rounded-b-[20px]">
      <Image
        src={profileImageUrl}
        alt={`${nickname} 디자이너 프로필`}
        fill
        sizes="100vw"
        priority
        className="object-cover"
        unoptimized={isLocalPreview}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,var(--color-black)_100%)]" />

      <DesignerProfileHeader actionType="none" onBack={onBack} />

      <button
        type="button"
        onClick={onEditImage}
        className="text-body-2-medium absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-4 py-2 text-gray-900 shadow-sm"
      >
        대표 이미지 수정
      </button>
    </section>
  );
}
