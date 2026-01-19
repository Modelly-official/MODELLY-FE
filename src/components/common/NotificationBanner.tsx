'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import CloseIcon from '@/public/icons/common/close.svg';
import BellIcon from '@/public/icons/common/notification-bell.svg';

interface NotificationBannerProps {
  title: string;
  body: string;
  targetId?: string;
  notificationType?: string;
  onClose: () => void;
}

/**
 * 포그라운드 푸시 알림 배너
 * - 화면 상단에 슬라이드 인
 * - 클릭 시 해당 페이지로 이동
 * - 5초 후 자동 닫힘
 */
export default function NotificationBanner({
  title,
  body,
  targetId,
  notificationType,
  onClose,
}: NotificationBannerProps) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 5000);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 5300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  /** 알림 클릭 시 페이지 이동 */
  const handleClick = () => {
    let targetUrl = '/notification';

    if (targetId) {
      const type = notificationType || '';

      if (type.includes('채팅') || type.includes('메시지')) {
        targetUrl = `/chat/${targetId}`;
      } else if (type.includes('예약')) {
        targetUrl = '/mypage/reservations';
      } else if (type.includes('리뷰')) {
        targetUrl = '/mypage/reviews';
      } else if (type.includes('일정')) {
        targetUrl = '/mypage/reservations';
      }
    }

    onClose();
    router.push(targetUrl);
  };

  /** 닫기 버튼 클릭 (이벤트 버블링 방지) */
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={`fixed top-0 left-0 right-0 z-9999 p-4 ${
        isExiting ? 'animate-notification-exit' : 'animate-slide-down'
      }`}
    >
      <div className="mx-auto max-w-[343px]">
        <div
          onClick={handleClick}
          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
        >
          {/* 아이콘 */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-500">
            <BellIcon className="size-5 text-white" />
          </div>
          {/* 내용 */}
          <div className="min-w-0 flex-1">
            <p className="text-body-2-semibold text-gray-900">{title}</p>
            {body && (
              <p className="text-body-2-regular mt-0.5 line-clamp-2 text-gray-600">{body}</p>
            )}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="cursor-pointer shrink-0 p-1 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
