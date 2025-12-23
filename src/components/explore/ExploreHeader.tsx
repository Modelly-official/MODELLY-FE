'use client';

import Image from 'next/image';

interface ExploreHeaderProps {
  view: 'designer' | 'recruitment';
  onViewChange: (view: 'designer' | 'recruitment') => void;
}

export default function ExploreHeader({ view, onViewChange }: ExploreHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-4">
      {/* 로고 */}
      <div className="relative h-[25.52px] w-[102.3px]">
        <Image src="/icons/explore/logo.svg" alt="Monde" fill className="object-contain" />
      </div>

      {/* 디자이너/공고 토글 */}
      <div className="flex gap-1 rounded-lg bg-gray-300 p-1">
        <button
          type="button"
          onClick={() => onViewChange('designer')}
          className={`rounded px-4 py-1 text-body-2-semibold transition-colors ${
            view === 'designer' ? 'bg-white text-gray-800' : 'text-gray-600'
          }`}
        >
          디자이너
        </button>
        <button
          type="button"
          onClick={() => onViewChange('recruitment')}
          className={`rounded px-4 py-1 text-body-2-semibold transition-colors ${
            view === 'recruitment' ? 'bg-white text-gray-800' : 'text-gray-600'
          }`}
        >
          공고
        </button>
      </div>
    </header>
  );
}

