'use client';

import DotIcon from '@/public/icons/myRecruitment/dot.svg';

interface DesignerProfileEditMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  wrapperClassName?: string;
  buttonClassName?: string;
  menuPositionClassName?: string;
  menuClassName?: string;
  menuWidthClassName?: string;
  itemClassName?: string;
  dividerClassName?: string;
  ariaLabel?: string;
  showOverlay?: boolean;
}

export default function DesignerProfileEditMenu({
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onDelete,
  wrapperClassName = 'relative',
  buttonClassName = 'flex h-5 w-5 cursor-pointer items-center justify-center',
  menuPositionClassName = 'top-8 right-0',
  menuClassName = '',
  menuWidthClassName = 'min-w-[47px]',
  itemClassName = 'text-caption-1-medium block w-full cursor-pointer px-[13px] py-1.5 whitespace-nowrap text-gray-900 hover:bg-gray-100',
  dividerClassName = 'border-gray-400',
  ariaLabel = '메뉴',
  showOverlay = true,
}: DesignerProfileEditMenuProps) {
  const menuContainerClassName = [
    'absolute z-20 overflow-hidden rounded-[10px] border border-gray-400 bg-white',
    menuWidthClassName,
    menuPositionClassName,
    menuClassName,
  ]
    .filter(Boolean)
    .join(' ');
  const editItemClassName = `${itemClassName} border-b ${dividerClassName}`;

  return (
    <div className={wrapperClassName}>
      <button type="button" onClick={onToggle} className={buttonClassName} aria-label={ariaLabel}>
        <DotIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {showOverlay && (
            <div
              className="fixed inset-0 z-10"
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
            />
          )}
          <div className={menuContainerClassName}>
            <button type="button" onClick={onEdit} className={editItemClassName}>
              수정
            </button>
            <button type="button" onClick={onDelete} className={itemClassName}>
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}
