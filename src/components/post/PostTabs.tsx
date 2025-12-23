'use client';

interface PostTabsProps {
  activeTab: 'detail' | 'review';
  onTabChange: (tab: 'detail' | 'review') => void;
}

export default function PostTabs({ activeTab, onTabChange }: PostTabsProps) {
  return (
    <div className="flex border-b border-gray-400">
      <button
        type="button"
        onClick={() => onTabChange('detail')}
        className={`flex-1 px-3 py-2.5 text-body-1-semibold transition-colors ${
          activeTab === 'detail' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-600'
        }`}
      >
        상세 내용
      </button>
      <button
        type="button"
        onClick={() => onTabChange('review')}
        className={`flex-1 px-3 py-2.5 text-body-1-medium transition-colors ${
          activeTab === 'review' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-600'
        }`}
      >
        디자이너 리뷰
      </button>
    </div>
  );
}

