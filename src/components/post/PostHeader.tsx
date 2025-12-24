'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PostHeaderProps {
  onBack?: () => void;
}

export default function PostHeader({ onBack }: PostHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-[52px] w-full max-w-[600px] -translate-x-1/2 items-center bg-transparent px-4 py-2.5 sm:w-[375px]">
      <button type="button" onClick={handleBack} className="flex size-6 items-center justify-center">
        <Image src="/icons/common/arrow-left.svg" alt="뒤로가기" width={10} height={10} />
      </button>
    </header>
  );
}
