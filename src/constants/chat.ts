// 채팅 API 구현 전 임시 데이터
import { Chat } from '@/src/types/chat';

export const mockChats: Chat[] = [
  {
    id: 1,
    name: '유민지',
    profileImage: '',
    lastMessage: '안녕하세요! 예약 가능할까요? 블라블라 어쩌구 저쩌구',
    lastTime: '18:30',
    unread: 2,
  },
  {
    id: 2,
    name: '박예린',
    profileImage: '',
    lastMessage: '네! 가능합니다 :)',
    lastTime: '18:10',
    unread: 0,
  },
  {
    id: 3,
    name: '윤서진',
    profileImage: '',
    lastMessage: '내일 뵐게요~',
    lastTime: '어제',
    unread: 1,
  },
];
