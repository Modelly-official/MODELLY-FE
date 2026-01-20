/**
 * 알림 타입별 라우팅 경로
 * - 'chat': 채팅 페이지 (targetId 필요)
 * - 나머지: 해당 경로로 직접 이동
 *
 */
export const NOTIFICATION_ROUTES: Record<string, string> = {
  // CHATTING
  '채팅 알림': 'chat',
  // RESERVATION
  '예약 확정': '/mypage/reservations',
  '예약 취소': '/mypage/reservations',
  '예약 신청 알림': '/mypage/reservations',
  // SCHEDULE
  '예약 변경': '/mypage/reservations',
  '예약 알림': '/mypage/reservations',
  // REVIEW
  '리뷰 알림': '/mypage/reviews',
  '리뷰 답글 알림': '/mypage/reviews',
};
