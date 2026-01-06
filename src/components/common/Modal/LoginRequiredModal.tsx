'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrl?: string;
}

export default function LoginRequiredModal({ isOpen, onClose, callbackUrl }: LoginRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoHome = () => {
    onClose();
    router.push('/');
  };

  const handleLogin = () => {
    onClose();
    const loginPath = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login';
    router.push(loginPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,28,30,0.4)]">
      <div className="relative w-[311px] rounded-[20px] bg-white px-5 py-6">
        {/* 안내 텍스트 */}
        <div className="mb-6 text-center">
          <p className="text-body-1-medium tracking-tight text-gray-900">로그인 후 이용 가능합니다</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          {/* 홈으로 이동 */}
          <button
            onClick={handleGoHome}
            className="text-body-2-medium h-12 flex-1 cursor-pointer rounded-full border border-gray-400 bg-white tracking-tight text-gray-900"
          >
            홈으로
          </button>

          {/* 로그인하기 버튼 */}
          <button
            onClick={handleLogin}
            className="text-body-2-medium h-12 flex-1 cursor-pointer rounded-full bg-gray-900 tracking-tight text-white"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
