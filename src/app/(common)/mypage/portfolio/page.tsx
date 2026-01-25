'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/arrow-left.svg';
import DesignerProfileEditPortfolio from '@/src/components/designerProfile/edit/DesignerProfileEditPortfolio';
import { mockPortfolioItems } from '@/src/mocks/portfolio';

export default function PortfolioManagePage() {
  const router = useRouter();
  const [portfolioItems, setPortfolioItems] = useState(mockPortfolioItems);
  const portfolioImages = useMemo(() => portfolioItems.map((item) => item.imageUrl), [portfolioItems]);

  const handleAddPortfolio = () => {
    router.push('/mypage/portfolio/create');
  };

  const handleEditPortfolio = (id: number) => {
    router.push(`/mypage/portfolio/${id}/edit`);
  };

  const handleEditImage = (index: number) => {
    const selected = portfolioItems[index];
    if (!selected) return;
    handleEditPortfolio(selected.id);
  };

  const handleDeleteImage = (index: number) => {
    setPortfolioItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="min-h-screen bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <LeftArrowIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">포트폴리오 관리</h1>
        <div className="size-6" />
      </header>

      <div className="flex flex-1 flex-col pb-[calc(88px+env(safe-area-inset-bottom))]">
        {portfolioItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-body-2-medium text-gray-500">등록된 포트폴리오가 없습니다.</p>
          </div>
        ) : (
          <div className="">
            <DesignerProfileEditPortfolio
              images={portfolioImages}
              onEditImage={handleEditImage}
              onDeleteImage={handleDeleteImage}
            />
          </div>
        )}
      </div>

      <div className="fixed right-0 bottom-0 left-0 w-full max-w-[375px] bg-white px-4 pt-3 pb-2">
        <button
          type="button"
          onClick={handleAddPortfolio}
          className="text-body-1-semibold flex w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 py-4 text-white"
        >
          신규 포트폴리오 추가하기
        </button>
      </div>
    </div>
  );
}
