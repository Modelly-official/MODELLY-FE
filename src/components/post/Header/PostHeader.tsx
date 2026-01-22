'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthReady } from '@/src/hooks/custom/mypage';

interface PostHeaderProps {
  onBack?: () => void;
}

export default function PostHeader({ onBack }: PostHeaderProps) {
  const router = useRouter();
  const { role, authReady } = useAuthReady();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    if (authReady && role === 'designer') {
      router.push('/myRecruitment');
      return;
    }

    router.push('/explore');
  };

  return (
    <header className="absolute top-0 left-0 z-50 flex h-[52px] w-full items-center bg-transparent px-4 py-2.5 safe-area-top">
      <button type="button" onClick={handleBack} className="flex size-6 items-center justify-center cursor-pointer">
        <Image src="/icons/common/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
      </button>
    </header>
  );
}
