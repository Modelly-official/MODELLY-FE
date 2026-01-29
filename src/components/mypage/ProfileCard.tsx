import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Skeleton } from '@/src/components/common';
import ProfileIcon from '@/public/icons/chat/profile.svg';

type ProfileCardProps = {
  name: string;
  email: string;
  profileImageSrc: string;
  nameIcon?: ReactNode;
  ctaButton?: {
    label: string;
    onClick?: () => void;
  };
  editHref?: string;
  onEdit?: () => void;
  onCardClick?: () => void;
  isLoading?: boolean;
};

export const ProfileCard = ({
  name,
  email,
  profileImageSrc,
  nameIcon,
  ctaButton,
  editHref,
  onEdit,
  onCardClick,
  isLoading = false,
}: ProfileCardProps) => {
  const hasProfileImage = Boolean(profileImageSrc);
  const isClickable = Boolean(onCardClick);

  return (
    <section
      className={`rounded-2xl bg-white pt-3 pb-2 ${isClickable ? 'cursor-pointer focus-visible:outline focus-visible:outline-gray-300' : ''}`}
      onClick={onCardClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onCardClick?.();
              }
            }
          : undefined
      }
      aria-label={isClickable ? name : undefined}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-[66px] w-[66px] overflow-hidden rounded-full">
            {isLoading ? (
              <Skeleton variant="circular" className="h-full w-full" />
            ) : !hasProfileImage ? (
              <div className="flex h-full w-full items-center justify-center bg-gray-300">
                <ProfileIcon className="size-11 text-gray-500" />
              </div>
            ) : (
              <Image src={profileImageSrc} alt="프로필 이미지" fill className="object-cover" sizes="64px" priority />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5">
              {isLoading ? (
                <Skeleton variant="text" className="h-5 w-28" />
              ) : (
                <>
                  <span className="text-head-3-semibold text-gray-900">{name}</span>
                  {nameIcon}
                  {editHref ? (
                    <Link
                      href={editHref}
                      aria-label="프로필 수정"
                      className="flex h-6 w-6 cursor-pointer items-center justify-center"
                    >
                      <Image src="/icons/myPage/edit.svg" alt="프로필 수정" width={24} height={24} />
                    </Link>
                  ) : (
                    onEdit && (
                      <button
                        type="button"
                        onClick={onEdit}
                        aria-label="프로필 수정"
                        className="flex h-6 w-6 cursor-pointer items-center justify-center"
                      >
                        <Image src="/icons/myPage/edit.svg" alt="프로필 수정" width={24} height={24} />
                      </button>
                    )
                  )}
                </>
              )}
            </div>
            {isLoading ? (
              <Skeleton variant="text" className="mt-1 h-4 w-36" />
            ) : (
              <p className="text-body-2-regular text-gray-600">{email}</p>
            )}
          </div>
        </div>
        {ctaButton &&
          (isLoading ? (
            <Skeleton className="h-10 w-20 rounded-xl" />
          ) : (
            <button
              type="button"
              onClick={ctaButton.onClick}
              className="text-body-2-medium shrink-0 cursor-pointer rounded-xl border border-gray-400 px-3 py-2 text-gray-900"
            >
              {ctaButton.label}
            </button>
          ))}
      </div>
    </section>
  );
};
