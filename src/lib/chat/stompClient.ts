import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 문서 기준 WebSocket 엔드포인트: wss://{host}/api/ws/chat (SockJS 필요)
const WS_PATH = '/api/ws/chat';
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const HTTP_URL = BASE + WS_PATH;

// STOMP 클라이언트 생성 (브라우저 전용). 토큰은 Authorization 헤더로 전달
export function createChatStompClient(token: string) {
  if (typeof window === 'undefined') return null;

  let attempt = 0;
  const baseDelay = 3000; // 3초 기본 재연결 간격

  const client = new Client({
    // SockJS 사용: brokerURL 대신 webSocketFactory 지정
    webSocketFactory: () =>
      new SockJS(HTTP_URL, undefined, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
      }),
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
  };

  client.onWebSocketClose = (evt) => {
    attempt += 1;
    // 지수 백오프, 최대 30초
    client.reconnectDelay = Math.min(30000, baseDelay * 2 ** attempt);
    if (process.env.NODE_ENV === 'development') {
      console.warn('[stomp] socket closed', evt?.code, evt?.reason);
    }
  };

  return client;
}

export function subscribeRoom<TPayload = unknown>(
  client: Client,
  roomId: string | number,
  onMessage: (payload: TPayload, frame: IMessage) => void,
) {
  return client.subscribe(`/sub/chat/rooms/${roomId}`, (frame: IMessage) => {
    const payload = JSON.parse(frame.body) as TPayload;
    onMessage(payload, frame);
  });
}

export function publishMessage(
  client: Client,
  roomId: string | number,
  body: { messageType: string; message?: string | null; imageUrls?: string[] | null },
) {
  client.publish({
    destination: `/pub/chat/rooms/${roomId}`,
    body: JSON.stringify(body),
  });
}

export function publishRead(client: Client, roomId: string | number, lastMessageId: number) {
  client.publish({
    destination: `/pub/chat/rooms/${roomId}/read`,
    body: JSON.stringify({ lastMessageId }),
  });
}
