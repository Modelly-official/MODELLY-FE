// 채팅 API 구현 전 임시 데이터
import { Message } from '@/src/types/chat';

export const defaultMessages: Message[] = [
  { id: 1, fromMe: false, text: '안녕하세요!', time: '18:00' },
  { id: 2, fromMe: true, text: '안녕하세요, 예약 도와드릴게요.', time: '18:02' },
  { id: 3, fromMe: false, text: '네 감사합니다.', time: '18:05' },
];

export default defaultMessages;
