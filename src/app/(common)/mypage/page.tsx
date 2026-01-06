'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useMemo, useState } from 'react';
import { BottomNav } from '@/src/components/common';
import { MenuList, MyMenuCard, ProfileCard } from '@/src/components/mypage';
import { getDesignerProfile, getModelProfile } from '@/src/apis';
import { getAccessToken, getUserRole, useAuthStore } from '@/src/stores';
import { LoginRequiredModal } from '@/src/components/common';

type Role = 'model' | 'designer';
type QuickAction = { label: string; icon?: ReactNode };
type ProfileResult = { role: Role; profile: { nickname: string; email?: string; profileImageUrl: string | null } };

const settingLinks = ['알람설정', '고객센터/FAQ'] as const;
const accountLinks = ['계정 추가하기', '로그아웃', '탈퇴하기'] as const;

export default function MypagePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [loginModalDismissed, setLoginModalDismissed] = useState(false);
  const notificationCount = 1; // 알림 API 연동 시 실제 값으로 교체
  const cookieRole = getUserRole();
  const token = getAccessToken();
  const derivedRole = (user?.role ?? cookieRole ?? 'model') as Role;
  const isLoggedIn = !!(user ?? token);

  const {
    data: profileResponse,
    isLoading: profileQueryLoading,
  } = useQuery<ProfileResult>({
    queryKey: ['mypage', 'profile', derivedRole],
    enabled: isLoggedIn,
    retry: false,
    queryFn: async () => {
      const cookieRole = getUserRole();
      const effectiveRole = (user?.role ?? cookieRole ?? derivedRole) as Role;

      const fetchDesigner = async (): Promise<ProfileResult> => {
        const res = await getDesignerProfile();
        return {
          role: 'designer',
          profile: {
            nickname: res.result.nickname,
            email: res.result.email,
            profileImageUrl: res.result.profileImageUrl,
          },
        };
      };

      const fetchModel = async (): Promise<ProfileResult> => {
        const res = await getModelProfile();
        return {
          role: 'model',
          profile: {
            nickname: res.result.nickname,
            email: res.result.email,
            profileImageUrl: res.result.profileImageUrl,
          },
        };
      };

      try {
        // 역할이 명확하면 해당 엔드포인트만 호출 (잘못된 엔드포인트로 떨어지는 것 방지)
        if (effectiveRole === 'designer') return await fetchDesigner();
        if (effectiveRole === 'model') return await fetchModel();

        // 역할이 불명확하면 모델 우선, 403/404 시 디자이너로 폴백
        return await fetchModel();
      } catch (error) {
        const shouldFallback =
          isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404);

        if (shouldFallback) {
          return fetchDesigner();
        }
        throw error;
      }
    },
  });

  const resolvedRole = (profileResponse?.role ?? derivedRole) as Role;

  const { profileImage, fallbackName, quickActions } = useMemo((): {
    profileImage: string;
    fallbackName: string;
    quickActions: QuickAction[];
  } => {
    if (resolvedRole === 'designer') {
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
  }, [resolvedRole]);

  const profileData = profileResponse?.profile;
  const hasProfileData = Boolean(profileData);
  const name = isLoggedIn ? profileData?.nickname ?? fallbackName : '로그인하세요';
  const email = isLoggedIn
    ? profileData?.email ?? user?.loginId ?? '이메일 정보를 불러올 수 없습니다.'
    : '로그인 후 확인할 수 있습니다.';
  const profileImageSrc = profileData?.profileImageUrl ?? profileImage;
  const isProfileLoading = isLoggedIn && !hasProfileData && profileQueryLoading;

  const ctaButton = useMemo(() => {
    if (!isLoggedIn) return undefined;
    if (resolvedRole === 'designer') return { label: '프로필 보기', onClick: () => router.push('/designer/profile') };
    return undefined;
  }, [isLoggedIn, resolvedRole, router]);

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
        isOpen={!isLoggedIn && !loginModalDismissed}
        onClose={() => setLoginModalDismissed(true)}
        callbackUrl="/mypage"
      />
    </div>
  );
}
