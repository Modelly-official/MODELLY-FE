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

// ===== 실제 프로젝트에서 사용되는 옵션들 =====

// 카테고리 (src/constants/explore.ts 기반)
const categoryOptions = [
  { value: 'HAIR', label: '헤어' },
  { value: 'NAIL', label: '네일' },
  { value: 'TATTOO', label: '타투' },
  { value: 'EYELASH', label: '속눈썹' },
];

// 정렬 옵션 (src/constants/explore.ts 기반)
const sortOptions = [
  { value: 'NEWEST', label: '최신순' },
  { value: 'DISTANCE', label: '거리순' },
  { value: 'MOST_REVIEWS', label: '후기 많은 순' },
];

// 연도 옵션 (마이페이지 리뷰에서 사용)
const currentYear = new Date().getFullYear();
const yearOptions = [
  { value: currentYear - 1, label: `${currentYear - 1}` },
  { value: currentYear, label: `${currentYear}` },
  { value: currentYear + 1, label: `${currentYear + 1}` },
];

// 월 옵션 (캘린더에서 사용)
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}월`,
}));

// ===== Form Variant Stories =====

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

// ===== Inline Variant Stories =====

// Inline Variant - 정렬 (탐색 페이지에서 사용)
export const InlineSort = {
  args: {
    options: sortOptions,
    value: 'NEWEST',
    variant: 'inline',
    ariaLabel: '정렬 방식 선택',
  },
  render: function Render(args) {
    const [value, setValue] = useState('NEWEST');
    return (
      <div className="flex items-center justify-end p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Inline Variant - 대형 연도 (마이페이지 리뷰에서 사용)
export const InlineLargeYear = {
  args: {
    options: yearOptions,
    value: currentYear,
    variant: 'inline',
    size: 'lg',
    ariaLabel: '연도 선택',
  },
  render: function Render(args) {
    const [value, setValue] = useState(currentYear);
    return (
      <div className="p-4">
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// Inline Variant - 스크롤 월 (캘린더에서 사용)
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

// ===== 실제 사용 예시 Stories =====

// 탐색 페이지 필터 영역
export const ExploreFiltersExample = {
  render: function Render() {
    const [sort, setSort] = useState('NEWEST');
    return (
      <div className="flex w-[360px] items-center justify-between bg-white p-4">
        <span className="text-body-2-medium text-gray-600">총 24개</span>
        <Dropdown
          variant="inline"
          ariaLabel="정렬 방식 선택"
          options={sortOptions}
          value={sort}
          onChange={setSort}
        />
      </div>
    );
  },
};

// 마이페이지 리뷰 연도 선택
export const MypageReviewYearExample = {
  render: function Render() {
    const [year, setYear] = useState(currentYear);
    return (
      <div className="flex w-[360px] items-center gap-4 bg-white p-4">
        <Dropdown
          variant="inline"
          size="lg"
          ariaLabel="연도 선택"
          options={yearOptions}
          value={year}
          onChange={setYear}
        />
        <span className="text-body-2-medium text-gray-600">작성한 리뷰</span>
      </div>
    );
  },
};
