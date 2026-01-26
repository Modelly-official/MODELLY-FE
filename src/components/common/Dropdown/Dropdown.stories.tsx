import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Dropdown from './Dropdown';

const meta = {
  title: 'Common/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['form', 'inline'],
      description: '드롭다운 스타일 변형',
    },
    size: {
      control: 'radio',
      options: ['sm', 'lg'],
      description: 'inline variant에서 텍스트 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    required: {
      control: 'boolean',
      description: '필수 입력 표시 (form variant)',
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 옵션들
const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'distance', label: '거리순' },
];

const categoryOptions = [
  { value: 'hair', label: '헤어' },
  { value: 'makeup', label: '메이크업' },
  { value: 'nail', label: '네일' },
  { value: 'skin', label: '피부관리' },
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
export const FormDefault: Story = {
  args: {
    options: categoryOptions,
    value: null,
    onChange: () => {},
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div className="w-[320px]">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Form Variant - 필수
export const FormRequired: Story = {
  args: {
    options: categoryOptions,
    value: null,
    onChange: () => {},
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
    required: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div className="w-[320px]">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Form Variant - 선택됨
export const FormSelected: Story = {
  args: {
    options: categoryOptions,
    value: 'hair',
    onChange: () => {},
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>('hair');
    return (
      <div className="w-[320px]">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Form Variant - 비활성화
export const FormDisabled: Story = {
  args: {
    options: categoryOptions,
    value: 'hair',
    onChange: () => {},
    placeholder: '카테고리를 선택해주세요',
    label: '카테고리',
    variant: 'form',
    disabled: true,
  },
};

// Inline Variant - 정렬
export const InlineSort: Story = {
  args: {
    options: sortOptions,
    value: 'latest',
    onChange: () => {},
    variant: 'inline',
    ariaLabel: '정렬 방식 선택',
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>('latest');
    return (
      <div className="flex items-center justify-end p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Inline Variant - 대형 (연도)
export const InlineLargeYear: Story = {
  args: {
    options: yearOptions,
    value: 2026,
    onChange: () => {},
    variant: 'inline',
    size: 'lg',
    ariaLabel: '연도 선택',
  },
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(2026);
    return (
      <div className="p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Inline Variant - 스크롤 (월)
export const InlineScrollMonth: Story = {
  args: {
    options: monthOptions,
    value: 6,
    onChange: () => {},
    variant: 'inline',
    ariaLabel: '월 선택',
    scrollToSelected: true,
    maxHeight: 200,
  },
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(6);
    return (
      <div className="p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};
