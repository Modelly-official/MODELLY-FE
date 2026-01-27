'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ArrowRightIcon from '@/public/icons/common/arrow-right.svg';
import SelectIcon from '@/public/icons/signup/select.svg';
import SelectedIcon from '@/public/icons/signup/selected.svg';
import { BottomNav, BaseModal } from '@/src/components/common';
import { Spinner } from '@/src/components/auth/common/Spinner';
import { MenuList, MyMenuCard, ProfileCard } from '@/src/components/mypage';
import { useAuthReady, useSimpleProfile } from '@/src/hooks/custom/mypage';
import { useLogout, useWithdraw } from '@/src/hooks/queries/auth';
import { useUnreadNotificationCount } from '@/src/hooks/queries';
import { useToast } from '@/src/hooks/common/useToast';
import {
  SETTING_LINKS,
  ACCOUNT_LINKS,
  MODEL_QUICK_ACTIONS,
  DESIGNER_QUICK_ACTIONS,
  ROLE_FALLBACK_NAMES,
  WITHDRAW_MODAL,
} from '@/src/constants/mypage';

export default function MypagePage() {
  const router = useRouter();
  const { user, role, isLoggedIn, authReady } = useAuthReady();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();
  const { showToast } = useToast();

  // 탈퇴 모달 상태
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawAgreed, setIsWithdrawAgreed] = useState(false);

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
    return { label: '프로필 보기', onClick: () => router.push('/myProfile') };
  }, [isLoggedIn, currentRole, router]);

  // 비로그인 상태 UI
  const showLoginPrompt = authReady && !isLoggedIn;
  const nameIcon = showLoginPrompt ? <ArrowRightIcon className="h-4 text-gray-400 ml-2" /> : undefined;

  // 읽지 않은 알림 개수
  const { data: unreadData } = useUnreadNotificationCount(authReady && isLoggedIn);
  const notificationCount = unreadData?.result?.unreadCount ?? 0;

  // 로그아웃 핸들러 (API 실패해도 성공으로 처리 - clearAuth는 finally에서 항상 실행됨)
  const handleLogout = () => {
    if (isLoggingOut) return;
    logout(undefined, {
      onSettled: () => {
        showToast('로그아웃되었습니다.');
        router.replace('/login'); // 수동 로그아웃은 callbackUrl 없음
      },
    });
  };

  // 탈퇴 모달 열기
  const handleOpenWithdrawModal = () => {
    setIsWithdrawAgreed(false);
    setIsWithdrawModalOpen(true);
  };

  // 탈퇴 모달 닫기
  const handleCloseWithdrawModal = () => {
    if (isWithdrawing) return;
    setIsWithdrawModalOpen(false);
    setIsWithdrawAgreed(false);
  };

  // 탈퇴 처리
  const handleWithdraw = () => {
    if (isWithdrawing || !isWithdrawAgreed) return;
    withdraw(undefined, {
      onSuccess: () => {
        showToast('탈퇴가 완료되었습니다.');
        router.replace('/login');
      },
      onError: () => {
        showToast('탈퇴 처리 중 오류가 발생했습니다.');
      },
      onSettled: () => {
        setIsWithdrawModalOpen(false);
      },
    });
  };

  // 계정 메뉴 아이템 (onClick 연결, 비로그인 시 비활성화)
  const accountMenuItems = ACCOUNT_LINKS.map((label) => ({
    label,
    onClick:
      label === '로그아웃' ? handleLogout : label === '탈퇴하기' ? handleOpenWithdrawModal : undefined,
    disabled: !isLoggedIn,
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
            onClick={() => router.push('/notification')}
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

      {/* 탈퇴 확인 모달 */}
      <BaseModal
        isOpen={isWithdrawModalOpen}
        onClose={handleCloseWithdrawModal}
        disableClose={isWithdrawing}
      >
        <div className="flex flex-col gap-6">
          {/* 제목 + 유의사항 */}
          <div className="flex flex-col items-center gap-6 text-gray-900">
            <p className="text-head-4-semibold text-center">{WITHDRAW_MODAL.title}</p>
            <ul className="flex flex-col gap-4 text-body-2-medium list-disc pl-5">
              {WITHDRAW_MODAL.notices.map((notice, index) => (
                <li key={index} className="whitespace-pre-wrap">
                  {notice}
                </li>
              ))}
            </ul>
          </div>

          {/* 체크박스 */}
          <div
            className="flex cursor-pointer items-center gap-3 px-2"
            onClick={() => setIsWithdrawAgreed(!isWithdrawAgreed)}
          >
            {isWithdrawAgreed ? <SelectedIcon /> : <SelectIcon />}
            <span className="text-body-2-medium text-gray-900">{WITHDRAW_MODAL.checkboxLabel}</span>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCloseWithdrawModal}
              disabled={isWithdrawing}
              className="flex h-12 flex-1 items-center justify-center rounded-full border border-gray-400 bg-white text-body-2-medium text-gray-900 disabled:cursor-not-allowed"
            >
              {WITHDRAW_MODAL.cancelButton}
            </button>
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={!isWithdrawAgreed || isWithdrawing}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-gray-900 text-body-2-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isWithdrawing ? <Spinner /> : WITHDRAW_MODAL.confirmButton}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
