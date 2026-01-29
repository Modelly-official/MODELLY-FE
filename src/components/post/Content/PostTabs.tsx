'use client';

interface PostTabsProps {
  activeTab: 'detail' | 'review';
  onTabChange: (tab: 'detail' | 'review') => void;
}

export default function PostTabs({ activeTab, onTabChange }: PostTabsProps) {
  return (
    <div className="border-b border-solid border-gray-400">
      <div className="flex px-4">
        <button
          type="button"
          onClick={() => onTabChange('detail')}
          className={`flex-1 px-3 py-2.5 transition-colors cursor-pointer ${
            activeTab === 'detail'
              ? 'text-body-1-semibold border-b-2 border-solid border-gray-900 text-gray-900 -mb-px'
              : 'text-body-1-medium text-gray-600'
          }`}
        >
          상세 내용
        </button>
        <button
          type="button"
          onClick={() => onTabChange('review')}
          className={`flex-1 px-3 py-2.5 transition-colors cursor-pointer ${
            activeTab === 'review'
              ? 'text-body-1-semibold border-b-2 border-solid border-gray-900 text-gray-900 -mb-px'
              : 'text-body-1-medium text-gray-600'
          }`}
        >
          디자이너 리뷰
        </button>
      </div>
    </div>
  );
}

