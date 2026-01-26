'use client';

import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/arrow-left.svg';
import PortfolioForm from '@/src/components/mypage/portfolio/PortfolioForm';
import { useToast } from '@/src/hooks/common/useToast';

export default function PortfolioCreatePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = () => {
    showToast('포트폴리오가 등록되었습니다.');
    router.push('/mypage/portfolio');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-13 items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.push('/mypage/portfolio')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <LeftArrowIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">포트폴리오 등록</h1>
        <div className="size-6" />
      </header>

      <div className="flex flex-1 flex-col px-4 pt-1 pb-[calc(118px+env(safe-area-inset-bottom))]">
        <PortfolioForm submitLabel="등록하기" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
