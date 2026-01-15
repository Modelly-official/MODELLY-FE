'use client';

import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import ChatHeader from '@/src/components/chat/chatroom/ChatHeader';
import MessageItem from '@/src/components/chat/chatroom/MessageItem';
import ReservationMessageItem from '@/src/components/chat/chatroom/ReservationMessageItem';
import ChatInput from '@/src/components/chat/chatroom/ChatInput';
import ChatReservationSummaryCard from '@/src/components/chat/chatroom/ChatReservationSummaryCard';
import { ReservationCancelModal, ReservationChangeModal, ReservationSuccessModal } from '@/src/components/reservation';
import { LoginRequiredModal } from '@/src/components/common';
import DropDownArrowIcon from '@/public/icons/common/arrow-down.svg';
import {
  useCancelReservation,
  useChatReservationSummary,
  useRequestReservationChange,
} from '@/src/hooks/queries/reservation';
import { useAuthHydration } from '@/src/hooks/custom';
import useChatRoom from '@/src/hooks/custom/chat/useChatRoom';
import { getUserRole, useAuthStore } from '@/src/stores';
import { formatChatDateLabel } from '@/src/utils/chat';
import type { ReservationCancelRequest, ReservationChangeRequest, ReservationInfo } from '@/src/types/reservation';

export default function ChatRoom() {
  const pathname = usePathname();
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const roomIdParam = routeParams?.roomId;
  const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
  const roomIdNumber = roomId ? Number(roomId) : undefined;
  const validRoomId = roomIdNumber != null && !Number.isNaN(roomIdNumber) ? roomIdNumber : undefined;
  const { isAuthenticated, isHydrated } = useAuthHydration();
  const [modalDismissed, setModalDismissed] = useState(false);
  const showLoginModal = isHydrated && !isAuthenticated && !modalDismissed;
  const callbackUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const activeRoomId = isAuthenticated ? roomId : undefined;
  const { messages, opponent, input, setInput, sendMessage, sendImage, fetchPrevMessages, hasNext, loading } =
    useChatRoom(activeRoomId);
  const headerTitle = opponent?.name ?? '';
  const roleLabel = opponent?.role === 'DESIGNER' ? '디자이너' : undefined;
  const requestChange = useRequestReservationChange();
  const cancelReservation = useCancelReservation();
  const roleFromStore = useAuthStore((state) => state.user?.role);
  const roleFromCookie = getUserRole();
  const userRole = roleFromStore ?? roleFromCookie;

  const containerRef = useRef<HTMLElement | null>(null);
  const isInitialScroll = useRef(true);
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevScrollTopRef = useRef<number | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingCancelChangeId, setPendingCancelChangeId] = useState<number | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const queryReservationInfo = useMemo<ReservationInfo | null>(() => {
    const reservationIdParam = searchParams.get('reservationId');
    const modelUserIdParam = searchParams.get('modelUserId');
    const modelName = searchParams.get('modelName');
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const recruitmentIdParam = searchParams.get('recruitmentId');
    const recruitmentTitle = searchParams.get('recruitmentTitle');
    const status = searchParams.get('status');

    if (!reservationIdParam || !modelUserIdParam || !modelName || !date || !startTime) return null;
    const reservationId = Number(reservationIdParam);
    const modelUserId = Number(modelUserIdParam);
    const recruitmentId = recruitmentIdParam ? Number(recruitmentIdParam) : null;
    if (Number.isNaN(reservationId) || Number.isNaN(modelUserId)) return null;

    return {
      reservationId,
      recruitmentId: Number.isNaN(recruitmentId) ? null : recruitmentId,
      recruitmentTitle: recruitmentTitle || undefined,
      modelUserId,
      modelName,
      date,
      startTime,
      endTime: endTime || undefined,
      status: status || undefined,
    };
  }, [searchParams]);

  const { data: fetchedReservationInfo } = useChatReservationSummary({
    role: userRole,
    opponentUserId: opponent?.userId,
    opponentName: opponent?.name,
    enabled: !queryReservationInfo,
  });

  const reservationInfo = queryReservationInfo ?? fetchedReservationInfo ?? null;
  const isConfirmedReservation =
    !reservationInfo?.status ||
    reservationInfo.status === 'RESERVATION_CONFIRMED' ||
    reservationInfo.status === '예약확정';
  const confirmedReservationInfo = isConfirmedReservation ? reservationInfo : null;

  const handleChangeSubmit = (data: ReservationChangeRequest) => {
    if (!confirmedReservationInfo) return;
    requestChange.mutate(
      { reservationId: confirmedReservationInfo.reservationId, payload: data, roomId: validRoomId },
      {
        onSuccess: () => {
          setIsChangeModalOpen(false);
          setSuccessMessage('예약 변경이 요청되었습니다');
          setIsSuccessModalOpen(true);
        },
      },
    );
  };

  const handleCancelSubmit = (data: ReservationCancelRequest) => {
    if (!confirmedReservationInfo) return;
    cancelReservation.mutate(
      {
        reservationId: confirmedReservationInfo.reservationId,
        payload: data,
        roomId: validRoomId,
        reservationChangeId: pendingCancelChangeId ?? undefined,
      },
      {
        onSuccess: () => {
          setIsCancelModalOpen(false);
          setPendingCancelChangeId(null);
          setSuccessMessage('예약 취소가 요청되었습니다');
          setIsSuccessModalOpen(true);
        },
      },
    );
  };

  const handleOpenCancelModal = (reservationChangeId?: number) => {
    setPendingCancelChangeId(reservationChangeId ?? null);
    setIsCancelModalOpen(true);
  };

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage('');
  };

  // 초기 스크롤 또는 새 메시지 도착 시 스크롤 처리
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. 최초 진입: messages가 0에서 1 이상이 되는 순간에만 스크롤
    if (isInitialScroll.current && prevMessagesLengthRef.current === 0 && messages.length > 0) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
        isInitialScroll.current = false;
      }, 30);
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    // 2. 무한 스크롤로 messages가 늘어난 경우 위치 보정
    if (
      prevScrollHeightRef.current !== null &&
      prevScrollTopRef.current !== null &&
      messages.length > prevMessagesLengthRef.current
    ) {
      const diff = container.scrollHeight - prevScrollHeightRef.current;
      requestAnimationFrame(() => {
        container.scrollTop = prevScrollTopRef.current! + diff;
      });
      prevScrollHeightRef.current = null;
      prevScrollTopRef.current = null;
      prevMessagesLengthRef.current = 0;
      return;
    }

    const last = messages[messages.length - 1];

    // 내가 보낸 메시지 or 스크롤이 아래쪽에 있을 때만 자동 스크롤
    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    const atBottom = distanceFromBottom < 150;
    if (last?.fromMe || atBottom) {
      requestAnimationFrame(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [messages]);

  // 무한 스크롤: 맨 위 도달 시 과거 메시지 불러오기
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || loading || !hasNext) return;
    if (container.scrollTop <= 20) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
      prevMessagesLengthRef.current = messages.length;
      fetchPrevMessages();
    }
  };

  return (
    <div className="relative flex h-screen flex-col bg-gray-200">
      {isReservationOpen && (
        <div className="safe-area-top absolute inset-x-0 top-0 z-20 rounded-b-[20px] bg-white pt-[15.5px] pb-5">
          <div className="flex justify-end px-4 pb-[15.5px]">
            <button
              type="button"
              onClick={() => setIsReservationOpen(false)}
              aria-expanded={isReservationOpen}
              className="text-body-2-medium flex cursor-pointer items-center gap-2 text-gray-800"
            >
              <span>예약 내역</span>
              <DropDownArrowIcon className="h-[9px] w-4 scale-[0.9] rotate-180 text-gray-800" />
            </button>
          </div>
          {confirmedReservationInfo ? (
            <div className="px-5 pt-3">
              <ChatReservationSummaryCard
                reservation={confirmedReservationInfo}
                viewerRole={userRole}
                onChange={() => setIsChangeModalOpen(true)}
                onCancel={() => handleOpenCancelModal()}
                isChangeLoading={requestChange.isPending}
                isCancelLoading={cancelReservation.isPending}
                showTitle={false}
              />
            </div>
          ) : (
            <div className="px-5 pt-3">
              <div className="text-body-2-medium rounded-2xl bg-white px-4 text-center text-gray-700/32">
                예약 내역이 없습니다
              </div>
            </div>
          )}
        </div>
      )}
      <ChatHeader
        title={headerTitle}
        roleLabel={roleLabel}
        showReservation
        isReservationOpen={isReservationOpen}
        onReservationClick={() => {
          setIsReservationOpen((prev) => !prev);
        }}
      />
      <main ref={containerRef} className="scrollbar-hide flex-1 overflow-auto px-4 py-3" onScroll={handleScroll}>
        <ul className="space-y-3">
          {messages.map((m, idx) => {
            const next = messages[idx + 1];
            const showTime = !next || next.time !== m.time;
            const prev = messages[idx - 1];
            const showDateDivider = !!m.dateKey && m.dateKey !== prev?.dateKey;
            if (m.messageType === 'RESERVATION' && m.reservation) {
              return (
                <Fragment key={m.id}>
                  {showDateDivider && (
                    <li className="flex justify-center py-1">
                      <span className="text-caption-1-medium rounded-full bg-gray-700/50 px-2.5 py-1 text-white">
                        {formatChatDateLabel(m.dateKey)}
                      </span>
                    </li>
                  )}
                  <ReservationMessageItem
                    message={m}
                    showTime={showTime}
                    onOpenCancelModal={handleOpenCancelModal}
                    avatarUrl={opponent?.profileImageUrl}
                    avatarName={opponent?.name}
                  />
                </Fragment>
              );
            }
            return (
              <Fragment key={m.id}>
                {showDateDivider && (
                  <li className="flex justify-center py-1">
                    <span className="text-caption-1-medium rounded-full bg-gray-700/50 px-4 py-1 text-white">
                      {formatChatDateLabel(m.dateKey)}
                    </span>
                  </li>
                )}
                <MessageItem
                  message={m}
                  showTime={showTime}
                  avatarUrl={opponent?.profileImageUrl}
                  avatarName={opponent?.name}
                />
              </Fragment>
            );
          })}
        </ul>
      </main>
      <ChatInput value={input} onChange={setInput} onSend={sendMessage} onImageSelect={sendImage} />

      {confirmedReservationInfo && (
        <>
          <ReservationChangeModal
            isOpen={isChangeModalOpen}
            onClose={() => setIsChangeModalOpen(false)}
            reservation={confirmedReservationInfo}
            onSubmit={handleChangeSubmit}
            isLoading={requestChange.isPending}
          />
          <ReservationCancelModal
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setPendingCancelChangeId(null);
            }}
            reservation={confirmedReservationInfo}
            onSubmit={handleCancelSubmit}
            isLoading={cancelReservation.isPending}
          />
          <ReservationSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            message={successMessage}
            onConfirm={handleSuccessConfirm}
          />
        </>
      )}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setModalDismissed(true)}
        callbackUrl={callbackUrl}
      />
    </div>
  );
}
