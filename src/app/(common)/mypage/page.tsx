'use client';

import Image from 'next/image';
import { ReactNode, useMemo } from 'react';
import { BottomNav } from '@/src/components/common';
import { ActionList, MyPageMenu, ProfileCard } from '@/src/components/mypage';
import { getUserRole, useAuthStore } from '@/src/stores';

type Role = 'model' | 'designer';
type QuickAction = { label: string; icon?: ReactNode };

const settingLinks = ['알람설정', '고객센터/FAQ'] as const;
const accountLinks = ['계정 추가하기', '로그아웃', '탈퇴하기'] as const;

export default function MypagePage() {
  const user = useAuthStore((state) => state.user);
  const role: Role = user?.role ?? getUserRole() ?? 'model';

  const { profileImage, fallbackName, quickActions, ctaButton } = useMemo((): {
    profileImage: string;
    fallbackName: string;
    quickActions: QuickAction[];
    ctaButton?: { label: string; onClick?: () => void };
  } => {
    if (role === 'designer') {
      return {
        profileImage: '/images/mocks/profile-2.png',
        fallbackName: '유디 디자이너',
        quickActions: [
          {
            label: '예약 내역',
            icon: <Image src="/icons/myPage/reservationList.svg" alt="예약 내역" width={24} height={24} />,
          },
          { label: '리뷰 관리', icon: <Image src="/icons/myPage/review.svg" alt="리뷰 관리" width={24} height={24} /> },
          {
            label: '포트폴리오',
            icon: <Image src="/icons/myPage/portfolio.svg" alt="포트폴리오" width={24} height={24} />,
          },
        ],
        ctaButton: { label: '프로필 보기', onClick: () => {} },
      };
    }
    return {
      profileImage: '/images/mocks/profile-1.png',
      fallbackName: '성유디',
      quickActions: [
        {
          label: '예약 내역',
          icon: <Image src="/icons/myPage/reservationList.svg" alt="예약 내역" width={24} height={24} />,
        },
        { label: '나의 리뷰', icon: <Image src="/icons/myPage/review.svg" alt="나의 리뷰" width={24} height={24} /> },
        { label: '찜', icon: <Image src="/icons/myPage/heart.svg" alt="찜" width={24} height={24} /> },
      ],
      ctaButton: undefined,
    };
  }, [role]);

  const name = user?.username ?? fallbackName;
  const email = user?.loginId ?? 'modelly@gmail.com';

  return (
    <div className="min-h-screen bg-white pt-[env(safe-area-inset-top)]">
      <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
        <header className="mb-3 flex items-center justify-between">
          <h1 className="text-head-3-semibold text-gray-900">마이페이지</h1>
          <button type="button" aria-label="알림" className="flex items-center justify-center">
            <Image src="/icons/myPage/alert.svg" alt="알림" width={24} height={24} />
          </button>
        </header>
        <ProfileCard name={name} email={email} profileImageSrc={profileImage} ctaButton={ctaButton} />
        <MyPageMenu actions={quickActions} />
        <ActionList items={settingLinks.map((label) => ({ label }))} />
        <div className="-mx-4 h-2 bg-gray-200" />
        <ActionList items={accountLinks.map((label) => ({ label }))} />
      </div>
      <BottomNav />
    </div>
  );
}
