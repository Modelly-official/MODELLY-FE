import { Suspense } from 'react';
import PortfolioPageClient from '@/src/components/portfolio/PortfolioPageClient';

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-body-2-medium text-gray-500">포트폴리오를 불러오는 중입니다.</p>
        </div>
      }
    >
      <PortfolioPageClient />
    </Suspense>
  );
}
