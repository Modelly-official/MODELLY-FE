import { Client, type IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// SockJS WebSocket 엔드포인트: wss://{host}/api/ws/chat
const WS_PATH = '/api/ws/chat';
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const HTTP_URL = BASE + WS_PATH;

// STOMP 클라이언트 생성 (브라우저 전용). 토큰은 Authorization 헤더로 전달

export function createChatStompClient(
  token: string,
  options?: { onConnect?: () => void; onDisconnect?: () => void; onError?: () => void }
) {
  if (typeof window === 'undefined') return null;

  let attempt = 0;
  const baseDelay = 3000; // 3초 기본 재연결 간격

  const client = new Client({
    // SockJS 사용
    webSocketFactory: () =>
      new SockJS(HTTP_URL, undefined, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
      }) as unknown as IStompSocket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    heartbeatIncoming: 15000,
    heartbeatOutgoing: 15000,
    reconnectDelay: baseDelay,
    // 개발 환경에서만 디버그 로그 노출
    debug: process.env.NODE_ENV === 'development' ? (msg) => console.log('[stomp]', msg) : undefined,
  });

  client.onConnect = () => {
    attempt = 0;
    client.reconnectDelay = baseDelay;
    options?.onConnect?.();
  };

  client.onDisconnect = () => {
    options?.onDisconnect?.();
  };

  client.onStompError = () => {
    options?.onError?.();
  };

  client.onWebSocketClose = (evt) => {
    attempt += 1;
    client.reconnectDelay = Math.min(30000, baseDelay * 2 ** attempt);
    if (process.env.NODE_ENV === 'development') {
      console.warn('[stomp] socket closed', evt?.code, evt?.reason);
    }
  };

  return client;
}
