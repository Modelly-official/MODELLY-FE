'use client';

import ProfileIcon from '@/public/icons/chat/profile.svg';
import {
  useAcceptReservationChange,
  useCancelReservationChange,
  useProceedReservationChange,
  useRejectReservationChange,
} from '@/src/hooks/queries/reservation';
import { formatDateToShort, formatTimeWithPeriod } from '@/src/utils/common';
import type { Message, ReservationMessagePayload } from '@/src/types/chat';

interface ReservationMessageItemProps {
  message: Message;
  showTime?: boolean;
  onOpenCancelModal?: (reservationChangeId?: number) => void;
}

const formatSchedule = (date: string, startTime: string, endTime?: string) => {
  const endLabel = endTime ? ` - ${formatTimeWithPeriod(endTime)}` : '';
  return `${formatDateToShort(date)} · ${formatTimeWithPeriod(startTime)}${endLabel}`;
};

const getTitle = (payload: ReservationMessagePayload) => {
  switch (payload.eventType) {
    case 'CHANGE_REQUEST':
      return '예약 일정 변경 요청드립니다 :)';
    case 'CHANGE_REJECTED':
      return '예약 변경 요청 거절';
    case 'CHANGE_PROCEED':
      return '기존 일정 진행 확정';
    case 'CHANGE_CANCEL':
      return '예약 변경 요청 취소';
    case 'RESERVATION_CANCEL':
      return '예약 취소';
    default:
      return '예약 안내';
  }
};

export default function ReservationMessageItem({
  message,
  showTime = true,
  onOpenCancelModal,
}: ReservationMessageItemProps) {
  const acceptMutation = useAcceptReservationChange();
  const rejectMutation = useRejectReservationChange();
  const cancelChangeMutation = useCancelReservationChange();
  const proceedMutation = useProceedReservationChange();
  const isActionPending =
    acceptMutation.isPending || rejectMutation.isPending || cancelChangeMutation.isPending || proceedMutation.isPending;
  const payload = message.reservation;

  if (!payload) return null;

  const renderDetails = () => {
    switch (payload.eventType) {
      case 'CHANGE_REQUEST':
        return null;
      case 'CHANGE_REJECTED':
        return <div className="text-body-2-regular text-gray-700">{payload.notice}</div>;
      case 'CHANGE_PROCEED':
        return (
          <>
            <div className="text-body-2-medium text-gray-700">
              일정: {formatSchedule(payload.date, payload.startTime, payload.endTime)}
            </div>
            <div className="text-body-2-regular text-gray-600">{payload.notice}</div>
          </>
        );
      case 'CHANGE_CANCEL':
        return (
          <>
            <div className="text-body-2-medium text-gray-700">
              일정: {formatSchedule(payload.date, payload.startTime, payload.endTime)}
            </div>
            <div className="text-body-2-regular text-gray-600">{payload.notice}</div>
          </>
        );
      case 'RESERVATION_CANCEL':
        return null;
      default:
        return null;
    }
  };

  const renderActions = () => {
    if (payload.eventType === 'CHANGE_REQUEST') {
      if (message.fromMe) {
        return (
          <button
            type="button"
            onClick={() => cancelChangeMutation.mutate(payload.reservationChangeId)}
            disabled={isActionPending}
            className="text-body-2-medium w-full rounded-[10px] bg-white px-14 py-[10.5px] text-gray-900"
          >
            변경 요청 취소
          </button>
        );
      }
      return (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => acceptMutation.mutate(payload.reservationChangeId)}
            disabled={isActionPending}
            className="text-body-2-medium flex-1 rounded-full bg-gray-900 px-4 py-2 text-white"
          >
            변경 수락
          </button>
          <button
            type="button"
            onClick={() => rejectMutation.mutate(payload.reservationChangeId)}
            disabled={isActionPending}
            className="text-body-2-medium flex-1 rounded-full border border-purple-200 bg-white px-4 py-2 text-gray-900"
          >
            거절
          </button>
        </div>
      );
    }

    if (payload.eventType === 'CHANGE_REJECTED' && !message.fromMe) {
      return (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => proceedMutation.mutate(payload.reservationChangeId)}
            disabled={isActionPending}
            className="text-body-2-medium flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-900"
          >
            기존대로 진행
          </button>
          {onOpenCancelModal && (
            <button
              type="button"
              onClick={() => onOpenCancelModal(payload.reservationChangeId)}
              disabled={isActionPending}
              className="text-body-2-medium flex-1 rounded-full bg-gray-900 px-4 py-2 text-white"
            >
              예약 취소
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  const renderChangeRequestCard = () => {
    if (payload.eventType !== 'CHANGE_REQUEST') return null;
    const oldLabel = formatChangeDateTime(payload.oldDate, payload.oldStartTime);
    const newLabel = formatChangeDateTime(payload.newDate, payload.newStartTime);

    if (!message.fromMe) {
      return (
        <div className="flex w-[222px] flex-col gap-3 rounded-2xl rounded-bl-none border border-gray-300 bg-white px-4 py-3">
          <div className="text-body-2-medium text-gray-900">{getTitle(payload)}</div>
          <div className="h-px w-full bg-gray-300" />
          <div className="flex flex-col gap-2 text-gray-600">
            <div className="flex items-baseline gap-3">
              <span className="text-body-2-regular text-gray-600">기존 일정</span>
              <span className="text-body-2-medium text-gray-900">{oldLabel}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-body-2-regular text-gray-600">변경 일정</span>
              <span className="text-body-2-medium text-gray-900">{newLabel}</span>
            </div>
          </div>
          <div className="h-px w-full bg-gray-300" />
          <div className="text-body-2-medium text-gray-900">{payload.reason}</div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => acceptMutation.mutate(payload.reservationChangeId)}
              disabled={isActionPending}
              className="text-body-2-medium w-full rounded-[10px] bg-gray-300 px-4 py-2.5 text-gray-900"
            >
              수락
            </button>
            <button
              type="button"
              onClick={() => rejectMutation.mutate(payload.reservationChangeId)}
              disabled={isActionPending}
              className="text-body-2-medium w-full rounded-[10px] bg-gray-300 px-4 py-2.5 text-gray-900"
            >
              거절
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-[222px] flex-col gap-3 rounded-2xl rounded-br-none bg-purple-300 px-4 py-3">
        <div className="text-body-2-medium text-purple-700">{getTitle(payload)}</div>
        <div className="h-px w-full bg-purple-400" />
        <div className="flex flex-col gap-2 text-purple-600">
          <div className="flex items-baseline gap-2.5">
            <span className="text-caption-1-medium text-purple-600">기존 일정</span>
            <span className="text-body-2-medium text-purple-700">{oldLabel}</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-caption-1-medium text-purple-600">변경 일정</span>
            <span className="text-body-2-medium text-purple-700">{newLabel}</span>
          </div>
        </div>
        <div className="h-px w-full bg-purple-400" />
        <div className="text-body-2-medium text-purple-700">{payload.reason}</div>
        {renderActions()}
      </div>
    );
  };

  const renderReservationCancelCard = () => {
    if (payload.eventType !== 'RESERVATION_CANCEL') return null;
    const scheduleLabel = formatChangeDateTime(payload.date, payload.startTime);

    if (!message.fromMe) {
      return (
        <div className="flex w-[222px] flex-col gap-3 rounded-2xl rounded-bl-none border border-gray-300 bg-white px-4 py-3">
          <div className="text-body-2-medium whitespace-pre-line text-gray-900">{payload.notice}</div>
          <div className="h-px w-full bg-gray-300" />
          <div className="flex items-baseline gap-3">
            <span className="text-body-2-regular text-gray-600">기존 일정</span>
            <span className="text-body-2-medium text-gray-900">{scheduleLabel}</span>
          </div>
          <div className="h-px w-full bg-gray-300" />
          <div className="text-body-2-medium text-gray-900">{payload.reason}</div>
        </div>
      );
    }

    return (
      <div
        className={`flex w-[222px] flex-col gap-3 rounded-2xl bg-purple-300 px-4 py-3 ${
          message.fromMe ? 'rounded-br-none' : ''
        }`}
      >
        <div className="text-body-2-medium whitespace-pre-line text-purple-700">{payload.notice}</div>
        <div className="h-px w-full bg-purple-400" />
        <div className="flex items-baseline gap-3">
          <span className="text-body-2-regular text-purple-600">기존 일정</span>
          <span className="text-body-2-medium text-purple-700">{scheduleLabel}</span>
        </div>
        <div className="h-px w-full bg-purple-400" />
        <div className="text-body-2-medium text-purple-700">{payload.reason}</div>
      </div>
    );
  };

  const renderDefaultCard = () => (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <div className="text-body-2-semibold text-gray-900">{getTitle(payload)}</div>
      <div className="flex flex-col gap-1">{renderDetails()}</div>
      {renderActions()}
    </div>
  );

  return (
    <li className={`flex items-end ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
      {!message.fromMe && (
        <div className="mr-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white">
            <ProfileIcon className="h-[26.15px] w-[26.15px] text-gray-400" />
          </div>
        </div>
      )}

      <div className={`flex min-h-[45px] flex-col ${message.fromMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {payload.eventType === 'CHANGE_REQUEST'
          ? renderChangeRequestCard()
          : payload.eventType === 'RESERVATION_CANCEL'
            ? renderReservationCancelCard()
            : renderDefaultCard()}

        {showTime && message.time && (
          <div className="text-caption-1-medium mt-0.5 flex items-center gap-2 text-gray-600">
            <span>{message.time}</span>
          </div>
        )}
      </div>
    </li>
  );
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const formatChangeDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) {
    return `${formatDateToShort(date)} ${time}`;
  }

  const dateObj = new Date(year, month - 1, day);
  const weekday = WEEKDAYS[dateObj.getDay()] ?? '';
  const [hour, minute] = time.split(':');
  const hourLabel = String(Number(hour));
  const timeLabel = minute && minute !== '00' ? `${hourLabel}시 ${minute}분` : `${hourLabel}시`;

  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}(${weekday}) ${timeLabel}`;
};
