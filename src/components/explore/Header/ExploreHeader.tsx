'use client';

import Image from 'next/image';

interface ExploreHeaderProps {
  view: 'designer' | 'recruitment';
  onViewChange: (view: 'designer' | 'recruitment') => void;
}

export default function ExploreHeader({ view, onViewChange }: ExploreHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-2">
      {/* 모아보기 */}
      <div className="text-head-3-semibold text-gray-950">모아보기</div>

      {/* 디자이너/공고 토글 */}
      <div className="flex gap-1 rounded-lg bg-gray-200 p-1">
        <button
          type="button"
          onClick={() => onViewChange('designer')}
          className={`text-body-2-semibold cursor-pointer rounded px-4 py-1 transition-colors ${
            view === 'designer' ? 'bg-white text-gray-800' : 'text-gray-600'
          }`}
        >
          디자이너
        </button>
        <button
          type="button"
          onClick={() => onViewChange('recruitment')}
          className={`text-body-2-semibold cursor-pointer rounded px-4 py-1 transition-colors ${
            view === 'recruitment' ? 'bg-white text-gray-800' : 'text-gray-600'
          }`}
        >
          공고
        </button>
      </div>
    </header>
  );
}
