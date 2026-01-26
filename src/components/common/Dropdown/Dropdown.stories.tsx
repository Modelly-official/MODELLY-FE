import { useState } from 'react';
import Dropdown from './Dropdown';

export default {
  title: 'Common/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

// 기본 옵션들
const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'distance', label: '거리순' },
];

const categoryOptions = [
  { value: 'HAIR', label: '헤어' },
  { value: 'NAIL', label: '네일' },
];

const yearOptions = [
  { value: 2024, label: '2024년' },
  { value: 2025, label: '2025년' },
  { value: 2026, label: '2026년' },
];

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}월`,
}));

// Form Variant - 기본
export const FormDefault = {
  args: {
    options: categoryOptions,
    value: null,
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
  },
  render: function Render(args) {
    const [value, setValue] = useState(null);
    return (
      <div className="w-[320px]">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Form Variant - 필수
export const FormRequired = {
  args: {
    options: categoryOptions,
    value: null,
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
    required: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState(null);
    return (
      <div className="w-[320px]">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Form Variant - 선택됨
export const FormSelected = {
  args: {
    options: categoryOptions,
    value: 'HAIR',
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
  },
  render: function Render(args) {
    const [value, setValue] = useState('HAIR');
    return (
      <div className="w-[320px]">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Form Variant - 비활성화
export const FormDisabled = {
  args: {
    options: categoryOptions,
    value: 'HAIR',
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
    disabled: true,
  },
};

// Inline Variant - 정렬
export const InlineSort = {
  args: {
    options: sortOptions,
    value: 'latest',
    variant: 'inline',
    ariaLabel: '정렬 방식 선택',
  },
  render: function Render(args) {
    const [value, setValue] = useState('latest');
    return (
      <div className="flex items-center justify-end p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Inline Variant - 대형 (연도)
export const InlineLargeYear = {
  args: {
    options: yearOptions,
    value: 2026,
    variant: 'inline',
    size: 'lg',
    ariaLabel: '연도 선택',
  },
  render: function Render(args) {
    const [value, setValue] = useState(2026);
    return (
      <div className="p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Inline Variant - 스크롤 (월)
export const InlineScrollMonth = {
  args: {
    options: monthOptions,
    value: 6,
    variant: 'inline',
    ariaLabel: '월 선택',
    scrollToSelected: true,
    maxHeight: 200,
  },
  render: function Render(args) {
    const [value, setValue] = useState(6);
    return (
      <div className="p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};
