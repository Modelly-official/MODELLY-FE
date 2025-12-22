import type { Client, IMessage } from '@stomp/stompjs';

// 구독(서버 → 클라이언트)
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

// 메세지 발행(클라이언트 → 서버)
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

// 읽음 처리 발행(클라이언트 → 서버)
export function publishRead(client: Client, roomId: string | number, lastMessageId: number) {
  client.publish({
    destination: `/pub/chat/rooms/${roomId}/read`,
    body: JSON.stringify({ lastMessageId }),
  });
}
