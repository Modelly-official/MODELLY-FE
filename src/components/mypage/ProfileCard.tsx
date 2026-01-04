import Image from 'next/image';

type ProfileCardProps = {
  name: string;
  email: string;
  profileImageSrc: string;
  ctaButton?: {
    label: string;
    onClick?: () => void;
  };
};

export const ProfileCard = ({ name, email, profileImageSrc, ctaButton }: ProfileCardProps) => {
  return (
    <section className="rounded-2xl bg-white py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-[66px] w-[66px] overflow-hidden rounded-full">
            <Image src={profileImageSrc} alt="프로필 이미지" fill className="object-cover" sizes="64px" priority />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5">
              <span className="text-head-3-semibold text-gray-900">{name}</span>
              <Image src="/icons/myPage/edit.svg" alt="프로필 수정" width={24} height={24} />
            </div>
            <p className="text-body-2-regular text-gray-600">{email}</p>
          </div>
        </div>
        {ctaButton && (
          <button
            type="button"
            onClick={ctaButton.onClick}
            className="text-body-2-medium shrink-0 rounded-xl border border-gray-400 px-3 py-2 text-gray-900"
          >
            {ctaButton.label}
          </button>
        )}
      </div>
    </section>
  );
};
