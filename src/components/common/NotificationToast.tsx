'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getNotificationTargetUrl } from '@/src/utils/notification';

interface NotificationToastProps {
  toastId: string | number;
  title: string;
  body: string;
  targetId?: string;
  notificationType?: string;
}

/**
 * Sonner 커스텀 토스트 컴포넌트
 * - 앱 아이콘 + 텍스트 디자인
 * - 클릭 시 해당 페이지로 이동
 * - 5초 후 자동 닫힘
 */
export default function NotificationToast({
  toastId,
  title,
  body,
  targetId,
  notificationType,
}: NotificationToastProps) {
  const router = useRouter();

  /** 알림 클릭 시 페이지 이동 */
  const handleClick = () => {
    const targetUrl = getNotificationTargetUrl({ notificationType, targetId, title });
    toast.dismiss(toastId);
    router.push(targetUrl);
  };

  return (
    <div className="flex w-full justify-center font-['Pretendard']">
      <div
        onClick={handleClick}
        className="flex min-w-[320px] w-fit cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg"
      >
        {/* 앱 아이콘 */}
        <Image
          src="/icons/app/icon-72x72.png"
          alt="Modelly"
          width={32}
          height={32}
          className="shrink-0 rounded-md"
        />

        {/* 내용 */}
        <div className="min-w-0 flex-1">
          <p className="text-body-2-medium truncate text-gray-900">{title}</p>
          {body && (
            <p className="text-caption-1-medium truncate text-gray-500">{body}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** 알림 토스트 표시 헬퍼 함수 */
export function showNotificationToast(props: Omit<NotificationToastProps, 'toastId'>) {
  return toast.custom(
    (toastId: string | number) => <NotificationToast toastId={toastId} {...props} />,
    {
      duration: 5000,
      position: 'top-center',
    }
  );
}
