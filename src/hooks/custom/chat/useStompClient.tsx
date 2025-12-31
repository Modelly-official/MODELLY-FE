'use client';

import { useEffect, useRef, useState } from 'react';
import type { Client } from '@stomp/stompjs';
import { createChatStompClient } from '@/src/utils/chat';
import { getAccessToken } from '@/src/stores';

/**
 *
 * - 앱에서 STOMP 클라이언트를 생성하고 수명주기를 관리
 *  내부적으로 createChatStompClient(token)를 호출하여 클라이언트를 만들고,
 *   컴포넌트 마운트 시 activate()를 호출, 언마운트 시 deactivate()를 호출
 *
 */
export default function useStompClient() {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // 인증 토큰을 읽어 STOMP 클라이언트를 생성
    const token = getAccessToken();
    if (!token) return;

    // createChatStompClient는 브라우저 환경에서만 Client를 반환
    const client = createChatStompClient(token);
    if (!client) return;

    // 연결/에러 핸들러: 연결 상태를 로컬 state에 반영
    client.onConnect = () => setConnected(true);
    client.onDisconnect = () => setConnected(false);
    client.onStompError = () => setConnected(false);

    // 활성화 및 ref 저장
    client.activate();
    clientRef.current = client;

    // 언마운트 시 안전하게 비활성화하고 ref를 정리
    return () => {
      try {
        client.deactivate();
      } catch {
        // deactivate 중 예외가 발생해도 무시
      }
      clientRef.current = null;
      setConnected(false);
    };
  }, []);

  return { clientRef, connected } as const;
}
