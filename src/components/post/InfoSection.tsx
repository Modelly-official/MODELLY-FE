'use client';

import Image from 'next/image';

interface InfoSectionProps {
  title: string;
  content: string;
  hasIcon?: boolean;
  iconType?: 'check' | 'cross';
}

export default function InfoSection({ title, content, hasIcon = true, iconType = 'check' }: InfoSectionProps) {
  const iconSrc = iconType === 'check' ? '/icons/post/check.svg' : '/icons/common/close.svg';
  const iconBgColor = iconType === 'check' ? 'bg-purple-600' : 'bg-gray-800';

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-body-2-semibold text-gray-900">{title}</h3>
      <div className="flex items-start gap-3 rounded-lg bg-gray-100 p-3">
        {hasIcon && (
          <div className={`flex size-[22px] shrink-0 items-center justify-center rounded-full ${iconBgColor}`}>
            <Image src={iconSrc} alt="" width={12} height={12} className="text-white" />
          </div>
        )}
        <p className="text-body-2-medium flex-1 text-black">{content}</p>
      </div>
    </div>
  );
}
