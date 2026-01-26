import { useState } from 'react';
import KebabMenu from './KebabMenu';

export default {
  title: 'Common/KebabMenu',
  component: KebabMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

// ===== 기본 Stories =====

// 기본 - 수정/삭제 (가장 일반적인 사용)
export const Default = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('수정') },
      { label: '삭제', onClick: () => console.log('삭제') },
    ],
  },
};

// 단일 항목 - 리뷰 고정
export const SingleItem = {
  args: {
    items: [{ label: '리뷰 고정', onClick: () => console.log('리뷰 고정') }],
  },
};

// 리뷰 고정 해제
export const UnpinReview = {
  args: {
    items: [{ label: '리뷰 고정 해제', onClick: () => console.log('리뷰 고정 해제') }],
  },
};

// ===== 실제 사용 예시 Stories =====

// 공고 카드 (RecruitmentCard)
export const RecruitmentCardExample = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('공고 수정') },
      { label: '삭제', onClick: () => console.log('공고 삭제') },
    ],
  },
  render: function Render(args) {
    return (
      <div className="relative w-[320px] rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-caption-1-medium text-purple-600">
                헤어
              </span>
              <span className="text-caption-1-medium text-gray-500">모집중</span>
            </div>
            <h3 className="text-body-1-semibold text-gray-900">펌 모델 급구합니다</h3>
            <p className="mt-1 text-body-2-medium text-gray-600">강남역 2번 출구</p>
          </div>
          <KebabMenu {...args} />
        </div>
      </div>
    );
  },
};

// 작성한 리뷰 카드 (WrittenReviewCard)
export const WrittenReviewCardExample = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('리뷰 수정') },
      { label: '삭제', onClick: () => console.log('리뷰 삭제') },
    ],
  },
  render: function Render(args) {
    return (
      <div className="relative w-[320px] rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-body-2-semibold text-gray-900">헤어살롱</span>
              <span className="text-caption-1-medium text-gray-400">2024.01.15</span>
            </div>
            <p className="line-clamp-2 text-body-2-medium text-gray-700">
              정말 만족스러운 시술이었습니다. 디자이너님이 친절하시고 원하는 스타일로 잘 해주셨어요.
            </p>
          </div>
          <KebabMenu {...args} />
        </div>
      </div>
    );
  },
};

// 디자이너 리뷰 고정 (DesignerReviewCard)
export const DesignerReviewPinExample = {
  render: function Render() {
    const [isPinned, setIsPinned] = useState(false);
    return (
      <div className="relative w-[320px] rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              {isPinned && (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-caption-1-medium text-purple-600">
                  고정됨
                </span>
              )}
              <span className="text-body-2-semibold text-gray-900">모델 A님</span>
              <span className="text-caption-1-medium text-gray-400">2024.01.15</span>
            </div>
            <p className="line-clamp-2 text-body-2-medium text-gray-700">
              디자이너님 덕분에 좋은 경험했습니다!
            </p>
          </div>
          <KebabMenu
            items={[
              {
                label: isPinned ? '리뷰 고정 해제' : '리뷰 고정',
                onClick: () => setIsPinned(!isPinned),
              },
            ]}
          />
        </div>
      </div>
    );
  },
};

// Controlled - 리스트에서 하나만 열기
export const ControlledList = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('수정') },
      { label: '삭제', onClick: () => console.log('삭제') },
    ],
  },
  render: function Render(args) {
    const [openId, setOpenId] = useState(null);
    const items = [
      { id: 1, title: '펌 모델 모집' },
      { id: 2, title: '염색 모델 모집' },
      { id: 3, title: '커트 모델 모집' },
    ];

    return (
      <div className="flex w-[320px] flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow">
            <span className="text-body-2-medium text-gray-900">{item.title}</span>
            <KebabMenu
              {...args}
              isOpen={openId === item.id}
              onOpenChange={(open) => setOpenId(open ? item.id : null)}
            />
          </div>
        ))}
        <p className="mt-2 text-caption-1-medium text-gray-500">
          * 리스트에서 하나의 메뉴만 열립니다
        </p>
      </div>
    );
  },
};

// 이미지 위 배치
export const OnImage = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('수정') },
      { label: '삭제', onClick: () => console.log('삭제') },
    ],
    wrapperClassName: 'absolute top-2 right-2',
  },
  render: function Render(args) {
    return (
      <div className="relative h-[200px] w-[200px] overflow-hidden rounded-2xl bg-gray-200">
        <div className="flex h-full items-center justify-center text-gray-500">이미지 영역</div>
        <KebabMenu {...args} />
      </div>
    );
  },
};
