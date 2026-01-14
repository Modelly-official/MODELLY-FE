'use client';

interface ChatCategoryChipsProps {
  selectedCategory: string;
  onChange: (category: string) => void;
}

const CATEGORY_CHIPS = [
  { code: 'ALL', label: '전체' },
  { code: 'HAIR', label: '헤어' },
  { code: 'NAIL', label: '네일' },
  { code: 'TATTOO', label: '타투' },
  { code: 'EYELASH', label: '속눈썹' },
];

export default function ChatCategoryChips({ selectedCategory, onChange }: ChatCategoryChipsProps) {
  return (
    <div className="scrollbar-hide flex gap-1.5 overflow-x-auto px-4 py-2">
      {CATEGORY_CHIPS.map((chip) => {
        const isActive = selectedCategory === chip.code;
        return (
          <button
            key={chip.code}
            type="button"
            onClick={() => onChange(chip.code)}
            className={`text-body-2-medium shrink-0 cursor-pointer rounded-[99px] px-3.5 py-1.5 ${
              isActive ? 'bg-gray-900 text-white' : 'border border-gray-400 text-gray-700'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
