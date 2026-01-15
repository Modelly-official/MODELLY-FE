'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ArrowRightIcon from '@/public/icons/common/arrow-right.svg';
import { BottomNav } from '@/src/components/common';
import { MenuList, MyMenuCard, ProfileCard } from '@/src/components/mypage';
import { useAuthReady, useSimpleProfile } from '@/src/hooks/custom/mypage';
import { useLogout } from '@/src/hooks/queries/auth';
import { useToast } from '@/src/hooks/common/useToast';
import {
  SETTING_LINKS,
  ACCOUNT_LINKS,
  MODEL_QUICK_ACTIONS,
  DESIGNER_QUICK_ACTIONS,
  ROLE_FALLBACK_NAMES,
} from '@/src/constants/mypage';

export default function MypagePage() {
  const router = useRouter();
  const { user, role, isLoggedIn, authReady } = useAuthReady();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { showToast } = useToast();

  // 프로필 조회
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useSimpleProfile({
    roleHint: role,
    enabled: authReady && isLoggedIn,
  });

  // 현재 역할 (API 응답 우선)
  const currentRole = profileResponse?.role ?? role;

  // 퀵 액션 메뉴
  const quickActions = useMemo(() => {
    const actions = currentRole === 'designer' ? DESIGNER_QUICK_ACTIONS : MODEL_QUICK_ACTIONS;
    return actions.map((action) => ({
      label: action.label,
      icon: <Image src={action.iconPath} alt={action.label} width={24} height={24} />,
      onClick: action.href ? () => router.push(action.href!) : undefined,
    }));
  }, [currentRole, router]);

  // 프로필 데이터
  const profile = profileResponse?.profile;
  const name = isLoggedIn ? (profile?.nickname ?? ROLE_FALLBACK_NAMES[currentRole]) : '로그인 및 회원가입';
  const email = isLoggedIn
    ? (profile?.email ?? user?.loginId ?? '이메일 정보를 불러올 수 없습니다.')
    : '더 편리하게 모앤디를 경험해보세요';
  const profileImageSrc = profile?.profileImageUrl ?? '';

  // 로딩 상태
  const isLoading = !authReady || (isLoggedIn && (isProfileError || (!profile && isProfileLoading)));

  // CTA 버튼 (디자이너만)
  const ctaButton = useMemo(() => {
    if (!isLoggedIn || currentRole !== 'designer') return undefined;
    return { label: '프로필 보기', onClick: () => router.push('/designer/profile') };
  }, [isLoggedIn, currentRole, router]);

  // 비로그인 상태 UI
  const showLoginPrompt = authReady && !isLoggedIn;
  const nameIcon = showLoginPrompt ? <ArrowRightIcon className="h-4 text-gray-400 ml-2" /> : undefined;

  // TODO: 알림 API 연동
  const notificationCount = 1;

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (isLoggingOut) return;
    logout(undefined, {
      onSuccess: () => {
        showToast('로그아웃되었습니다.');
        router.push('/login');
      },
      onError: () => {
        showToast('로그아웃에 실패했습니다.');
      },
    });
  };

  // 계정 메뉴 아이템 (onClick 연결)
  const accountMenuItems = ACCOUNT_LINKS.map((label) => ({
    label,
    onClick: label === '로그아웃' ? handleLogout : undefined,
  }));

  return (
    <div className="min-h-screen bg-white pt-[env(safe-area-inset-top)]">
      <div className="flex flex-col">
        {/* 헤더 */}
        <header className="flex h-[52px] items-center justify-between py-3 pr-3 pl-5">
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

        {/* 콘텐츠 */}
        <div className="flex flex-col gap-3 px-4">
          <ProfileCard
            name={name}
            email={email}
            profileImageSrc={profileImageSrc}
            ctaButton={ctaButton}
            editHref={isLoggedIn ? '/mypage/profile/edit' : undefined}
            nameIcon={nameIcon}
            onCardClick={showLoginPrompt ? () => router.push('/login') : undefined}
            isLoading={isLoading}
          />
          <MyMenuCard actions={quickActions} />
          <MenuList items={[...SETTING_LINKS]} />
          <div className="-mx-4 h-2 bg-gray-200" />
          <MenuList items={accountMenuItems} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
