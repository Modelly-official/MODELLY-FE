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

// 기본 - 수정/삭제
export const Default = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('수정') },
      { label: '삭제', onClick: () => console.log('삭제') },
    ],
  },
};

// 위험 액션 포함
export const WithDanger = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('수정') },
      { label: '삭제', onClick: () => console.log('삭제'), variant: 'danger' },
    ],
  },
};

// 단일 항목 - 고정/해제
export const SingleItem = {
  args: {
    items: [{ label: '리뷰 고정', onClick: () => console.log('고정') }],
  },
};

// 다중 항목
export const MultipleItems = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('수정') },
      { label: '복제', onClick: () => console.log('복제') },
      { label: '공유', onClick: () => console.log('공유') },
      { label: '삭제', onClick: () => console.log('삭제'), variant: 'danger' },
    ],
  },
};

// 카드 내 배치
export const InCard = {
  args: {
    items: [
      { label: '수정', onClick: () => console.log('수정') },
      { label: '삭제', onClick: () => console.log('삭제') },
    ],
  },
  render: function Render(args) {
    return (
      <div className="relative w-[300px] rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-body-1-semibold text-gray-900">카드 제목</h3>
            <p className="text-body-2-medium text-gray-600">카드 설명 텍스트</p>
          </div>
          <KebabMenu {...args} />
        </div>
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
      { id: 1, title: '첫 번째 항목' },
      { id: 2, title: '두 번째 항목' },
      { id: 3, title: '세 번째 항목' },
    ];

    return (
      <div className="flex w-[300px] flex-col gap-2">
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
