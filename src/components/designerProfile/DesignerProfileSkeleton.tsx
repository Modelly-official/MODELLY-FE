'use client';

import { Skeleton } from '@/src/components/common';

interface DesignerProfileSkeletonProps {
  showActionBar?: boolean;
}

export default function DesignerProfileSkeleton({ showActionBar = false }: DesignerProfileSkeletonProps) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-white ${showActionBar ? 'pb-[calc(70px+env(safe-area-inset-bottom))]' : ''}`}
    >
      {/* Hero */}
      <div className="relative h-[374px] w-full overflow-hidden rounded-b-[20px]">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="safe-area-top absolute top-0 right-0 left-0 flex items-center justify-between px-4 py-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <Skeleton variant="circular" className="h-10 w-10" />
        </div>
        <div className="absolute right-5 bottom-6 left-5 flex flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="h-6 w-6" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Intro + Recruitments */}
      <section className="flex flex-col gap-1 px-4 pt-5 pb-3">
        <div className="rounded-2xl bg-gray-100 px-4 py-4">
          <Skeleton className="h-4 w-20" />
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        <div className="flex flex-col gap-3 py-5">
          <Skeleton className="h-5 w-32" />
          {[0, 1].map((index) => (
            <div key={`recruitment-skeleton-${index}`} className="flex items-center gap-3 overflow-hidden bg-white">
              <Skeleton className="h-[72px] w-[72px] rounded-xl" />
              <div className="flex flex-1 flex-col gap-2 py-[3.5px] pr-3">
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-10 rounded" />
                  <Skeleton className="h-5 w-10 rounded" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs + Grid */}
      <section className="border-gray-200">
        <div className="grid h-13 grid-cols-2 border-b border-gray-400">
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-3 gap-2.5 px-4 pt-3 pb-[calc(32px+env(safe-area-inset-bottom))]">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={`portfolio-skeleton-${index}`} className="h-[151px] w-full rounded-lg" />
          ))}
        </div>
      </section>

      {showActionBar && (
        <div className="fixed bottom-0 left-1/2 z-50 h-[76px] w-full -translate-x-1/2 bg-white px-4 py-3 sm:w-[375px]">
          <div className="flex h-[52px] items-center gap-3">
            <Skeleton variant="circular" className="h-[52px] w-[52px]" />
            <Skeleton className="h-[52px] flex-1 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
