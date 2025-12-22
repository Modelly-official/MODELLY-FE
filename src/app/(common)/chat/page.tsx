'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createChatRoom } from '@/src/apis/chat/chat';
import ChatList from '@/src/components/chat/chatlist/ChatList';
import { getUserRole, useAuthStore } from '@/src/stores';
import type { Chat } from '@/src/types/chat';

/**
 * 임시 하드코딩: 모델(userId=3) ↔ 디자이너(userId=2) 1:1 방 1개만 리스트로 노출
 */
export default function ChatPage() {
  const router = useRouter();
  const storeRole = useAuthStore((state) => state.user?.role);
  const [role, setRole] = useState<'model' | 'designer' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolved = storeRole ?? getUserRole();
    setRole(resolved);
  }, [storeRole]);

  const targetUserId = useMemo(() => {
    if (role === 'designer') return 3; // 디자이너 -> 모델 userId=3
    if (role === 'model') return 2; // 모델 -> 디자이너 userId=2
    return null;
  }, [role]);

  const counterpartLabel = useMemo(() => {
    if (role === 'designer') return '모델(userId=3)';
    if (role === 'model') return '디자이너(userId=2)';
    return '상대방 정보 없음';
  }, [role]);

  const chats: Chat[] | undefined = useMemo(() => {
    if (!role || !targetUserId) return undefined;
    return [
      {
        id: 'hardcoded-test',
        name: role === 'designer' ? '테스트(모델 userId=3)' : '테스트(디자이너 userId=2)',
        lastMessage: `${counterpartLabel}과 연결`,
        lastTime: '',
        unread: 0,
      },
    ];
  }, [role, targetUserId, counterpartLabel]);

  const handleEnter = async (_chat?: Chat) => {
    if (!targetUserId) {
      setError('대상 유저가 설정되지 않았습니다.');
      return;
    }
    setError(null);
    void _chat;
    try {
      const res = await createChatRoom(targetUserId);
      if (res.isSuccess && res.result?.chatRoomId) {
        router.push(`/chat/${res.result.chatRoomId}`);
        return;
      }
      throw new Error(res.message || '채팅방 생성/조회 실패');
    } catch (err) {
      console.error('create chat room error', err);
      setError('채팅방 생성에 실패했습니다.');
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <h1 className="text-head-3-semibold mb-4 px-4">채팅</h1>
      {error && <p className="mb-4 px-4 text-red-500">{error}</p>}
      {role && chats && <ChatList chats={chats} onSelect={handleEnter} />}
    </div>
  );
}
