'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 2초 후 퇴장 애니메이션 시작
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // 퇴장 애니메이션 후 완전히 제거
    const closeTimer = setTimeout(() => {
      onClose();
    }, 2300); // 2000ms (표시 시간) + 300ms (퇴장 애니메이션)

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  // 서버 사이드 렌더링 방지
  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-[42px] left-1/2 z-9999 -translate-x-1/2">
      <div
        className={`text-body-2-medium rounded-2xl bg-black px-6 py-3 whitespace-nowrap text-white ${isExiting ? 'animate-toast-exit' : 'animate-toast-enter'} `}
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
