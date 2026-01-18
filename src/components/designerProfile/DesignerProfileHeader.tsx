'use client';

import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import EditIcon from '@/public/icons/profile/edit.svg';
import ShareIcon from '@/public/icons/profile/share.svg';

type ActionType = 'edit' | 'share' | 'none';

interface DesignerProfileHeaderProps {
  actionType?: ActionType;
  onBack: () => void;
  onAction?: () => void;
}

export default function DesignerProfileHeader({ actionType = 'none', onBack, onAction }: DesignerProfileHeaderProps) {
  const actionLabel = actionType === 'edit' ? '프로필 수정' : '프로필 공유';
  const ActionIcon = actionType === 'edit' ? EditIcon : ShareIcon;

  return (
    <header className="absolute top-0 right-0 left-0 z-10 flex h-13 items-center justify-between px-4 py-3.5">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className="flex cursor-pointer items-center justify-center"
      >
        <ArrowLeftIcon className="h-6 w-6 text-black" />
      </button>
      {actionType !== 'none' && (
        <button
          type="button"
          aria-label={actionLabel}
          onClick={onAction}
          className="flex cursor-pointer items-center justify-center"
        >
          <ActionIcon className="h-6 w-6 text-black" />
        </button>
      )}
    </header>
  );
}
