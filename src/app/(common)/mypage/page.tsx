'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { BottomNav } from '@/src/components/common';
import { MenuList, MyMenuCard, ProfileCard } from '@/src/components/mypage';
import { useDesignerProfile, useModelProfile } from '@/src/hooks/queries';
import { getAccessToken, getUserRole, useAuthStore } from '@/src/stores';
import { LoginRequiredModal } from '@/src/components/common';

type Role = 'model' | 'designer';
type QuickAction = { label: string; icon?: ReactNode };

const settingLinks = ['알람설정', '고객센터/FAQ'] as const;
const accountLinks = ['계정 추가하기', '로그아웃', '탈퇴하기'] as const;

// 클라이언트에서만 인증 상태 확인 (hydration mismatch 방지)
const subscribeToAuth = () => () => {};
const getAuthSnapshot = () => !!getAccessToken();
const getServerSnapshot = () => false;

export default function MypagePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerSnapshot);
  const [role, setRole] = useState<Role>('model');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [loginModalDismissed, setLoginModalDismissed] = useState(false);
  const notificationCount = 1; // 알림 API 연동 시 실제 값으로 교체

  // 쿠키/스토어 기반으로 클라이언트에서 로그인 상태와 역할을 동기화
  useEffect(() => {
    const cookieRole = getUserRole();
    setRole((user?.role ?? cookieRole ?? 'model') as Role);
    setIsLoggedIn(!!(user ?? cookieRole));
    setAuthReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isModel = role === 'model';
  const isDesigner = role === 'designer';

  const { data: modelProfile, isLoading: isModelLoading } = useModelProfile(isLoggedIn && isModel);
  const { data: designerProfile, isLoading: isDesignerLoading } = useDesignerProfile(isLoggedIn && isDesigner);

  const { profileImage, fallbackName, quickActions } = useMemo((): {
    profileImage: string;
    fallbackName: string;
    quickActions: QuickAction[];
  } => {
    if (role === 'designer') {
      return {
        profileImage: '',
        fallbackName: '디자이너',
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
      };
    }
    return {
      profileImage: '',
      fallbackName: '모델',
      quickActions: [
        {
          label: '예약 내역',
          icon: <Image src="/icons/myPage/reservationList.svg" alt="예약 내역" width={24} height={24} />,
        },
        { label: '나의 리뷰', icon: <Image src="/icons/myPage/review.svg" alt="나의 리뷰" width={24} height={24} /> },
        { label: '찜', icon: <Image src="/icons/myPage/heart.svg" alt="찜" width={24} height={24} /> },
      ],
    };
  }, [role]);

  const profileData = isModel ? modelProfile?.result : designerProfile?.result;
  const name = isLoggedIn ? (profileData?.nickname ?? user?.username ?? fallbackName) : '로그인하세요';
  const email = isLoggedIn
    ? (profileData?.email ?? user?.loginId ?? '이메일 정보를 불러올 수 없습니다.')
    : '로그인 후 확인할 수 있습니다.';
  const profileImageSrc = profileData?.profileImageUrl ?? profileImage;
  const isProfileLoading = !authReady || (isLoggedIn && (isModelLoading || isDesignerLoading));

  const ctaButton = useMemo(() => {
    if (!isLoggedIn) return undefined;
    if (role === 'designer') return { label: '프로필 보기', onClick: () => router.push('/designer/profile') };
    return undefined;
  }, [isLoggedIn, role, router]);

  return (
    <div className="min-h-screen bg-white pt-[env(safe-area-inset-top)]">
      <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
        <header className="mb-3 flex items-center justify-between pl-1">
          <h1 className="text-head-3-semibold text-gray-900">마이페이지</h1>
          <button
            type="button"
            aria-label="알림"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center"
          >
            <Image src="/icons/myPage/alert.svg" alt="알림" width={24} height={24} />
            {notificationCount > 0 && (
              <span className="text-caption-1-medium absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-500 px-1 text-white">
                {notificationCount}
              </span>
            )}
          </button>
        </header>
        <ProfileCard
          name={name}
          email={email}
          profileImageSrc={profileImageSrc}
          ctaButton={ctaButton}
          editHref={isLoggedIn ? '/mypage/profile/edit' : undefined}
          isLoading={isProfileLoading}
        />
        <MyMenuCard actions={quickActions} />
        <MenuList items={settingLinks.map((label) => ({ label }))} />
        <div className="-mx-4 h-2 bg-gray-200" />
        <MenuList items={accountLinks.map((label) => ({ label }))} />
      </div>
      <BottomNav />
      <LoginRequiredModal
        isOpen={!isAuthenticated && !loginModalDismissed}
        onClose={() => setLoginModalDismissed(true)}
        callbackUrl="/mypage"
      />
    </div>
  );
}
