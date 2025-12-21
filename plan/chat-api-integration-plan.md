# Plan

Next.js 기반 채팅 UI를 REST(목록/메시지/방 생성/이미지 업로드)와 STOMP(WebSocket)로 연결해 실시간 송수신·읽음 처리·무한 스크롤을 완성한다. 인증은 STOMP CONNECT 시 Authorization 헤더로 처리한다.

## Requirements
- 채팅방 목록 조회: GET `/chat/rooms?page&size`, unread/lastMessageTime 표시
- 채팅방 생성/조회: POST `/chat/rooms` (targetUserId)
- 메시지 조회: GET `/chat/rooms/{roomId}/messages?cursorMessageId&size` (latest→older, nextCursor/hasNext, lastReadMessageId)
- 메시지 전송: STOMP publish `/pub/chat/rooms/{roomId}` with `{messageType: TEXT|IMAGE, message, imageUrls}`
- 읽음 처리: STOMP publish `/pub/chat/rooms/{roomId}/read` with `{lastMessageId}`, subscribe `/sub/chat/rooms/{roomId}` for TEXT/IMAGE/READ 이벤트
- 이미지 전송: REST `POST /chat/rooms/{roomId}/images` 업로드 후 STOMP payload에 imageUrls 포함

## Scope
- In: 타입/어댑터 정비, chat API 모듈 추가, 목록/채팅방 UI 데이터 연동, STOMP 클라이언트 구축·재연결, 메시지 전송/읽음/무한 스크롤, 기본 로딩·에러/빈 상태 UX
- Out: 백엔드 변경, 파일 업로드 정책 정의(필드명/제한은 확인 후 보완), 푸시 알림

## Files and entry points
- `src/apis/axios.ts`, 신규 `src/apis/chat.ts`, `src/apis/index.ts`
- `src/types/chat.ts`, `src/constants/chat.ts`, `src/constants/messages.ts`
- `src/components/chat/chatlist/*`, `src/app/chat/page.tsx`
- `src/hooks/chat/useChatRoom.tsx`, `src/components/chat/chatroom/*`, `src/app/chat/[id]/page.tsx`
- (옵션) `src/lib/chat/stompClient.ts` 같은 커스텀 STOMP 래퍼

## Data model / API changes
- `Chat`: `{roomId, otherUserId, name, profileImageUrl, messageType, lastMessage, lastMessageTime, unreadMessages, role}` 매핑, 시간 포맷터 추가
- `Message`: `{messageId, senderUserId, messageType, message, imageUrls, createdAt, read}`; `fromMe`는 `senderUserId` vs 로그인 사용자 비교로 계산
- STOMP payload 타입: TEXT/IMAGE 메시지, READ 이벤트(lastReadMessageId, readerUserId) 정의

## Action items
[ ] STOMP 클라이언트 의존성(@stomp/stompjs) 추가 및 브라우저 전용 설정, `reconnectDelay`/백오프 정책 확정  
[ ] `src/types/chat.ts` 확장 및 서버 응답→UI용 어댑터(시간 포맷, fromMe 계산) 유틸 추가  
[ ] `src/apis/chat.ts` 구현: `getChatRooms`, `createChatRoom`, `getMessages`, `uploadImages`(요청 포맷 확인), 공용 에러 핸들링/타입 정의 후 `src/apis/index.ts` export  
[ ] STOMP 래퍼 작성: connect(token), subscribe(`/sub/chat/rooms/{roomId}`), publish(`/pub/chat/rooms/{roomId}`, `/pub/chat/rooms/{roomId}/read`), 재연결 시 자동 재구독 처리  
[ ] ChatList 데이터 패칭 훅/컴포넌트 교체: 목록 조회+무한 스크롤(또는 페이지네이션), 로딩/에러/빈 상태, 시간·unread 포맷 반영, mock 제거  
[ ] `useChatRoom` 확장: 초기 메시지 로드(최신 size), 위로 스크롤 시 `cursorMessageId`로 과거 메시지 더 불러오기, lastReadMessageId 표시  
[ ] 메시지 전송 UX: 입력→낙관적 append→STOMP publish→실패 시 롤백/토스트, IMAGE는 업로드 후 publish, 전송 중 상태 처리  
[ ] 읽음 처리: 방 진입/새 메시지 수신 시 lastMessageId로 READ publish, 수신된 READ 이벤트로 읽음/카운트 동기화(방 목록도 갱신)  
[ ] 상태 공유: 목록과 방 상태를 store/context로 묶거나 쿼리 키 무효화로 동기화, 메시지 정렬/중복 방지  
[ ] 공통 UX/에러: 스켈레톤, 빈 상태, 토스트; 401/토큰 만료 시 재인증 흐름 검증

## Testing and validation
- `npm run dev` 후 `/chat` 목록/무한 스크롤, `/chat/{roomId}`에서 메시지 로드·전송·읽음 수동 검증
- 네트워크/STOMP 프레임으로 Authorization 헤더, payload 필드, 401/500 에러 처리 확인
- STOMP 끊김/재연결 시 구독/중복/누락 검증, cursor 경계(맨 위/맨 아래) 확인
- 이미지 업로드 실패/취소 시 롤백, 전송 실패 재시도 동작 확인

## Risks and edge cases
- STOMP 재연결 간 누락/중복, out-of-order 메시지 정렬 문제
- 클라이언트/서버 시간차로 인한 정렬/표시 오류
- 긴 히스토리 로딩 성능 및 메모리 증가
- 이미지 업로드 포맷/사이즈 제한 미확인으로 인한 실패

## Open questions
- `POST /chat/rooms/{roomId}/images` 요청 포맷(멀티파트, 필드명), 응답 스키마?
- READ 이벤트 payload에 추가 필드 여부, unread 재계산 규칙?
- STOMP CONNECT/FRAME 인증 실패 시 에러 코드와 재인증 절차?
