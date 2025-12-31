'use client';

import { useCallback, useState } from 'react';
import type { Client } from '@stomp/stompjs';
import { getChatImagePresigned } from '@/src/apis/chat/image';
import { publishMessage } from '@/src/utils/chat';
import type { SendChatMessagePayload } from '@/src/types/chat';

// 채팅 이미지 전송 훅
export default function useChatImage({
  roomId,
  clientRef,
  stompConnected,
}: {
  roomId?: string | number;
  clientRef: React.RefObject<Client | null>;
  stompConnected: boolean;
}) {
  const [sendingImage, setSendingImage] = useState(false);

  const sendImage = useCallback(
    async (file: File) => {
      if (!roomId) return;
      const client = clientRef.current;
      if (!client || !stompConnected) {
        throw new Error('채팅 서버에 연결되지 않았습니다.');
      }
      setSendingImage(true);
      try {
        // 이미지 업로드용 presigned URL을 백엔드에서 발급받음
        const presigned = await getChatImagePresigned(roomId);
        if (!presigned.isSuccess || !presigned.result?.uploadUrl || !presigned.result?.imageUrl) {
          throw new Error(presigned.message || '이미지 업로드 URL을 가져오지 못했습니다.');
        }
        // 이미지 파일을 S3에 업로드
        const { uploadUrl, imageUrl } = presigned.result;
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: file,
        });
        if (!uploadRes.ok) {
          throw new Error(`이미지 업로드 실패 (${uploadRes.status})`);
        }
        // 업로드가 성공하면 STOMP로 이미지 메시지 전송
        const payload: SendChatMessagePayload = {
          messageType: 'IMAGE',
          imageUrls: [imageUrl],
          message: null,
        };
        publishMessage(client, roomId, payload);
      } finally {
        setSendingImage(false);
      }
    },
    [roomId, clientRef, stompConnected],
  );

  return { sendImage, sendingImage } as const;
}
