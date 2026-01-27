'use client';

import { useState, useRef } from 'react';
import DotIcon from '@/public/icons/myRecruitment/dot.svg';

export interface MenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface KebabMenuProps {
  items: MenuItem[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  // controlled state (리스트에서 "한 번에 하나만 열기" 지원)
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;

  // 스타일 오버라이드
  wrapperClassName?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

export default function KebabMenu({
  items,
  position = 'top-right',
  isOpen: controlledIsOpen,
  onOpenChange,
  wrapperClassName,
  buttonClassName,
  menuClassName,
}: KebabMenuProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isOpen;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(newState);
    }
    onOpenChange?.(newState);
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onOpenChange?.(false);
  };

  const handleItemClick = (e: React.MouseEvent, onClick: () => void) => {
    e.stopPropagation();
    handleClose();
    onClick();
  };

  // 위치 클래스 매핑
  const positionClasses = {
    'top-right': 'top-6 right-0',
    'top-left': 'top-6 left-0',
    'bottom-right': 'bottom-6 right-0',
    'bottom-left': 'bottom-6 left-0',
  };

  return (
    <div className={wrapperClassName || 'relative'} ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={buttonClassName || 'flex size-5 cursor-pointer items-center justify-center'}
        aria-label="더보기"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <DotIcon className="size-5 text-gray-900" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={handleClose} />
          <div
            className={
              menuClassName ||
              `absolute ${positionClasses[position]} z-20 overflow-hidden rounded-[10px] border border-gray-400 bg-white`
            }
            role="menu"
          >
            {items.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={(e) => handleItemClick(e, item.onClick)}
                className={`block w-full cursor-pointer whitespace-nowrap px-[13px] py-[6px] text-caption-1-medium hover:bg-gray-100 ${
                  item.variant === 'danger' ? 'text-error' : 'text-gray-900'
                } ${index < items.length - 1 ? 'border-b border-gray-400' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
