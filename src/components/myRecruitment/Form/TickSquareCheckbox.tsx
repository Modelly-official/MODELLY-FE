'use client';

import TickSquareUncheckedIcon from '@/public/icons/myRecruitment/form/tick-square-unchecked.svg';
import TickSquareCheckedIcon from '@/public/icons/myRecruitment/form/tick-square-checked.svg';

interface TickSquareCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function TickSquareCheckbox({ label, checked, onChange }: TickSquareCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex cursor-pointer items-center gap-2"
    >
      {checked ? <TickSquareCheckedIcon /> : <TickSquareUncheckedIcon />}
      <span className="text-body-1-medium text-gray-900">{label}</span>
    </button>
  );
}
