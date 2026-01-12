'use client';

import { useState } from 'react';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import {
  useAcceptReservationChange,
  useCancelReservationChange,
  useProceedReservationChange,
  useRejectReservationChange,
} from '@/src/hooks/queries/reservation';
import { RESERVATION_TEXT } from '@/src/constants/chat';
import { formatDateToShort, formatTimeWithPeriod } from '@/src/utils/common';
import type { Message } from '@/src/types/chat';

interface ReservationMessageItemProps {
  message: Message;
  showTime?: boolean;
  onOpenCancelModal?: (reservationChangeId?: number) => void;
}

const formatSchedule = (date: string, startTime: string, endTime?: string) => {
  const endLabel = endTime ? ` - ${formatTimeWithPeriod(endTime)}` : '';
  return `${formatDateToShort(date)} · ${formatTimeWithPeriod(startTime)}${endLabel}`;
};

const CARD_WIDTH = 'w-[222px]';

export default function ReservationMessageItem({
  message,
  showTime = true,
  onOpenCancelModal,
}: ReservationMessageItemProps) {
  const [hasProceeded, setHasProceeded] = useState(false);
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
        return null;
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
            className="text-body-2-medium w-full cursor-pointer rounded-[10px] bg-white px-14 py-[10.5px] text-gray-900 disabled:cursor-not-allowed"
          >
            {RESERVATION_TEXT.changeRequestCancel}
          </button>
        );
      }
      return (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => acceptMutation.mutate(payload.reservationChangeId)}
            disabled={isActionPending}
            className="text-body-2-medium flex-1 cursor-pointer rounded-[10px] bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed"
          >
            {RESERVATION_TEXT.changeAccept}
          </button>
          <button
            type="button"
            onClick={() => rejectMutation.mutate(payload.reservationChangeId)}
            disabled={isActionPending}
            className="text-body-2-medium flex-1 cursor-pointer rounded-[10px] border border-purple-200 bg-white px-4 py-2 text-gray-900 disabled:cursor-not-allowed"
          >
            {RESERVATION_TEXT.reject}
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
            className="text-body-2-medium flex-1 cursor-pointer rounded-[10px] border border-gray-300 px-4 py-2 text-gray-900 disabled:cursor-not-allowed"
          >
            {RESERVATION_TEXT.proceed}
          </button>
          {onOpenCancelModal && (
            <button
              type="button"
              onClick={() => onOpenCancelModal(payload.reservationChangeId)}
              disabled={isActionPending}
              className="text-body-2-medium flex-1 cursor-pointer rounded-[10px] bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed"
            >
              {RESERVATION_TEXT.reservationCancel}
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
    const tone = getCardTone(message.fromMe);
    const labelClass = message.fromMe ? `text-caption-1-medium ${tone.label}` : `text-body-2-regular ${tone.label}`;
    const valueClass = `text-body-2-medium ${tone.text}`;
    const rowGap = message.fromMe ? 'gap-2.5' : 'gap-3';

    if (!message.fromMe) {
      return (
        <div className={`flex ${CARD_WIDTH} flex-col gap-3 ${tone.container} px-4 py-3`}>
          <div className={`text-body-2-medium ${tone.text}`}>{RESERVATION_TEXT.changeRequestTitle}</div>
          <div className={`h-px w-full ${tone.divider}`} />
          <div className="flex flex-col gap-2">
            {renderScheduleRow(RESERVATION_TEXT.labelOldSchedule, oldLabel, labelClass, valueClass, rowGap)}
            {renderScheduleRow(RESERVATION_TEXT.labelNewSchedule, newLabel, labelClass, valueClass, rowGap)}
          </div>
          <div className={`h-px w-full ${tone.divider}`} />
          <div className={`text-body-2-medium ${tone.text}`}>{payload.reason}</div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => acceptMutation.mutate(payload.reservationChangeId)}
              disabled={isActionPending}
              className="text-body-2-medium w-full cursor-pointer rounded-[10px] bg-gray-300 px-4 py-2.5 text-gray-900 disabled:cursor-not-allowed"
            >
              {RESERVATION_TEXT.accept}
            </button>
            <button
              type="button"
              onClick={() => rejectMutation.mutate(payload.reservationChangeId)}
              disabled={isActionPending}
              className="text-body-2-medium w-full cursor-pointer rounded-[10px] bg-gray-300 px-4 py-2.5 text-gray-900 disabled:cursor-not-allowed"
            >
              {RESERVATION_TEXT.reject}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${CARD_WIDTH} flex-col gap-3 ${tone.container} px-4 py-3`}>
        <div className={`text-body-2-medium ${tone.text}`}>{RESERVATION_TEXT.changeRequestTitle}</div>
        <div className={`h-px w-full ${tone.divider}`} />
        <div className="flex flex-col gap-2">
          {renderScheduleRow(RESERVATION_TEXT.labelOldSchedule, oldLabel, labelClass, valueClass, rowGap)}
          {renderScheduleRow(RESERVATION_TEXT.labelNewSchedule, newLabel, labelClass, valueClass, rowGap)}
        </div>
        <div className={`h-px w-full ${tone.divider}`} />
        <div className={`text-body-2-medium ${tone.text}`}>{payload.reason}</div>
        {renderActions()}
      </div>
    );
  };

  const renderReservationCancelCard = () => {
    if (payload.eventType !== 'RESERVATION_CANCEL') return null;
    const scheduleLabel = formatChangeDateTime(payload.date, payload.startTime);
    const tone = getCardTone(message.fromMe);

    return (
      <div className={`flex ${CARD_WIDTH} flex-col gap-3 ${tone.container} px-4 py-3`}>
        <div className={`text-body-2-medium whitespace-pre-line ${tone.text}`}>{payload.notice}</div>
        <div className={`h-px w-full ${tone.divider}`} />
        {renderScheduleRow(
          RESERVATION_TEXT.labelOldSchedule,
          scheduleLabel,
          `text-body-2-regular ${tone.label}`,
          `text-body-2-medium ${tone.text}`,
        )}
        <div className={`h-px w-full ${tone.divider}`} />
        <div className={`text-body-2-medium ${tone.text}`}>{payload.reason}</div>
      </div>
    );
  };

  const renderChangeRejectedCard = () => {
    if (payload.eventType !== 'CHANGE_REJECTED') return null;
    const tone = getCardTone(message.fromMe);
    const isRequester = !message.fromMe;
    const isProceedDisabled = isActionPending || hasProceeded || !isRequester;

    return (
      <div className={`flex ${CARD_WIDTH} flex-col gap-3 ${tone.container} px-4 py-3`}>
        <div className={`text-body-2-regular whitespace-pre-line ${tone.text}`}>{payload.notice}</div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              if (hasProceeded || isActionPending) return;
              setHasProceeded(true);
              proceedMutation.mutate(payload.reservationChangeId, {
                onError: () => setHasProceeded(false),
              });
            }}
            disabled={isProceedDisabled}
            className={`text-body-2-medium w-full cursor-pointer rounded-[10px] py-3 ${tone.button} disabled:cursor-not-allowed`}
          >
            {RESERVATION_TEXT.proceed}
          </button>
          <button
            type="button"
            onClick={() => onOpenCancelModal?.(payload.reservationChangeId)}
            disabled={isProceedDisabled}
            className={`text-body-2-medium w-full cursor-pointer rounded-[10px] py-3 ${tone.button} disabled:cursor-not-allowed`}
          >
            {RESERVATION_TEXT.reservationCancel}
          </button>
          {!isRequester && (
            <span className="text-caption-1-medium text-purple-600">{RESERVATION_TEXT.onlyOtherCanSelect}</span>
          )}
        </div>
      </div>
    );
  };

  const renderChangeProceedCard = () => {
    if (payload.eventType !== 'CHANGE_PROCEED') return null;
    const scheduleLabel = formatChangeDateTime(payload.date, payload.startTime);
    const tone = getCardTone(message.fromMe);

    return (
      <div className={`flex ${CARD_WIDTH} flex-col gap-3 ${tone.container} px-4 py-3`}>
        <div className={`text-body-2-medium whitespace-pre-line ${tone.text}`}>{payload.notice}</div>
        <div className={`h-px w-full ${tone.divider}`} />
        {renderScheduleRow(
          RESERVATION_TEXT.labelOldSchedule,
          scheduleLabel,
          `text-body-2-regular ${tone.label}`,
          `text-body-2-medium ${tone.text}`,
        )}
      </div>
    );
  };

  const renderChangeCancelCard = () => {
    if (payload.eventType !== 'CHANGE_CANCEL') return null;
    const scheduleLabel = formatChangeDateTime(payload.date, payload.startTime);
    const tone = getCardTone(message.fromMe, { dividerClass: 'bg-gray-200' });
    const noticeText = message.fromMe ? RESERVATION_TEXT.changeCancelNotice : payload.notice;

    return (
      <div className={`flex ${CARD_WIDTH} flex-col gap-3 ${tone.container} px-4 py-3`}>
        <div className={`text-body-2-medium whitespace-pre-line ${tone.text}`}>{noticeText}</div>
        <div className={`h-px w-full ${tone.divider}`} />
        {renderScheduleRow(
          RESERVATION_TEXT.labelOldSchedule,
          scheduleLabel,
          `text-body-2-regular ${tone.label}`,
          `text-body-2-medium ${tone.text}`,
        )}
      </div>
    );
  };

  const renderDefaultCard = () => (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <div className="text-body-2-semibold text-gray-900">{RESERVATION_TEXT.defaultTitle}</div>
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
            : payload.eventType === 'CHANGE_REJECTED'
              ? renderChangeRejectedCard()
              : payload.eventType === 'CHANGE_PROCEED'
                ? renderChangeProceedCard()
                : payload.eventType === 'CHANGE_CANCEL'
                  ? renderChangeCancelCard()
                  : renderDefaultCard()}

        {showTime && message.time && (
          <div className="text-caption-1-medium mt-0.5 flex items-center gap-2 text-gray-600">
            {message.fromMe && message.read === false && <span className="text-purple-600">안읽음</span>}
            {showTime && <span>{message.time}</span>}
          </div>
        )}
      </div>
    </li>
  );
}

const getCardTone = (
  fromMe: boolean,
  options?: {
    dividerClass?: string;
    borderClass?: string;
    buttonClass?: string;
  },
) => {
  if (fromMe) {
    return {
      container: 'rounded-2xl rounded-br-none bg-purple-300',
      text: 'text-purple-700',
      label: 'text-purple-600',
      divider: 'bg-purple-400',
      button: 'bg-white text-gray-800',
    };
  }

  return {
    container: `rounded-2xl rounded-bl-none border ${options?.borderClass ?? 'border-gray-300'} bg-white`,
    text: 'text-gray-900',
    label: 'text-gray-600',
    divider: options?.dividerClass ?? 'bg-gray-300',
    button: options?.buttonClass ?? 'bg-gray-300 text-gray-900',
  };
};

const renderScheduleRow = (
  label: string,
  value: string,
  labelClass: string,
  valueClass: string,
  gapClass = 'gap-3',
) => (
  <div className={`flex items-baseline ${gapClass}`}>
    <span className={labelClass}>{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);

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
