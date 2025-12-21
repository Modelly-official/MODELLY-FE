채팅 WebSocket API(Docs)
STOMP WebSocket을 통해 채팅 기능을 사용할 때 필요한 프로토콜 문서입니다. 이 엔드포인트들은 Swagger 문서 전용이며 실제 동작은 WebSocket/STOMP로만 이루어집니다.

POST
/docs/chat/send-message
채팅 메시지 발송 (STOMP)

채팅 메시지를 STOMP WebSocket으로 전송할 때 사용하는 요청 형식입니다.

🔌 WebSocket URL

wss://{host}/api/ws/chat
📮 Publish

/pub/chat/rooms/{roomId}
📥 Subscribe

/sub/chat/rooms/{roomId}
🔐 인증

WebSocket CONNECT 시 Authorization 헤더에 JWT 포함
📝 예시 요청 (텍스트) { "messageType": "TEXT", "message": "안녕하세요!", "imageUrls": null }

📝 예시 요청 (이미지)

먼저 REST API로 업로드: POST /api/chat/rooms/{roomId}/images
응답받은 S3 URL 배열을 imageUrls에 포함해 전송
{ "messageType": "IMAGE", "imageUrls": ["https://s3.../img1.png"], "message": null }

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
"message": "string",
"imageUrls": [
"string"
],
"messageType": "TEXT"
}
Responses
Code Description Links
200
OK

Media type

_/_
Controls Accept header.
Example Value
Schema
{
"messageId": 0,
"chatRoomId": 0,
"senderId": 0,
"messageType": "TEXT",
"message": "string",
"imageUrls": [
"string"
],
"createdAt": "2025-12-21T03:57:56.349Z",
"read": true
}
No links

POST
/docs/chat/read
메시지 읽음 처리 (STOMP)

특정 메시지까지 읽었음을 STOMP로 서버에 알려줄 때 사용하는 형식입니다.

📮 Publish

/pub/chat/rooms/{roomId}/read
📥 Subscribe

/sub/chat/rooms/{roomId}
🔐 인증

WebSocket CONNECT 시 Authorization 헤더에 JWT 포함
📝 예시 요청 { "lastMessageId": 123 }

📝 예시 응답 { "chatRoomId": 1, "messageType": "READ", "readerUserId": 10, "lastReadMessageId": 123 }

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
"lastMessageId": 0
}
Responses
Code Description Links
200
OK

Media type

_/_
Controls Accept header.
Example Value
Schema
{
"chatRoomId": 0,
"messageType": "TEXT",
"readerUserId": 0,
"lastReadMessageId": 0
}

GET
/chat/rooms
내 채팅방 목록 조회 (페이지네이션 / 무한 스크롤)

현재 로그인한 유저가 참여 중인 채팅방 목록을 조회합니다. 각 채팅방은 가장 최근 메시지 시간을 기준으로 정렬됩니다.

📌 정렬 기준

각 채팅방의 마지막 메시지 생성 시간을 기준으로 내림차순 정렬
아직 메시지가 한 번도 없는 채팅방은 createdAt(채팅방 생성 시간)을 기준으로 정렬
가장 최근에 대화한 채팅방이 리스트의 맨 위에 오도록 정렬됩니다.
📥 Request Param

page : 0부터 시작하는 페이지 번호

예) page=0, size=20 → 가장 최근 채팅방 20개
예) page=1, size=20 → 그 다음 채팅방 20개
size : 한 번에 가져올 채팅방 개수 (기본값 20)

📤 Response (ChatRoomListResponse)

roomId : 채팅방 ID
otherUserId : 상대 유저의 User ID
name : 상대방 이름(모델) / 활동명(디자이너)
profileImageUrl : 상대방 프로필 이미지
messageType : 마지막 메시지 타입(TEXT / IMAGE)
lastMessage : 마지막 메시지 내용 (IMAGE인 경우 "이미지")
lastMessageTime : 마지막 메시지 생성 시간
unreadMessages : 해당 채팅방에서 내가 아직 읽지 않은 메시지 수
role : 상대방의 역할 (DESIGNER / MODEL)
Parameters
Try it out
Name Description
page
integer($int32)
(query)
Default value : 0

0
size
integer($int32)
(query)
Default value : 20

20
Responses
Code Description Links
200
OK

Media type

_/_
Controls Accept header.
Example Value
Schema
{
"isSuccess": true,
"code": "string",
"message": "string",
"result": [
{
"roomId": 0,
"otherUserId": 0,
"name": "string",
"profileImageUrl": "string",
"messageType": "TEXT",
"lastMessage": "string",
"lastMessageTime": "2025-12-21T04:03:45.849Z",
"unreadMessages": 0,
"role": "DESIGNER"
}
]
}
No links

POST
/chat/rooms
채팅방 생성 또는 기존 채팅방 조회

현재 로그인한 유저와 targetUserId(상대방 유저) 조합으로 1:1 채팅방을 생성하거나, 이미 존재하는 경우 기존 채팅방 ID를 그대로 반환합니다.

✅ 디자이너 ↔ 모델 조합만 채팅 가능

currentUser = 디자이너, targetUser = 모델
currentUser = 모델, targetUser = 디자이너
그 외 조합(모델-모델, 디자이너-디자이너)은 허용되지 않으며 에러가 발생합니다.
📥 Request Body

targetUserId : 채팅을 시작할 상대방의 User ID
📤 Response

chatRoomId : 생성되었거나, 이미 존재하는 채팅방의 ID
⚠️ 동시 요청 처리

동일한 디자이너-모델 조합으로 채팅방 생성 요청이 동시에 들어와도 DB unique 제약 + 예외 처리로 인해 채팅방은 항상 1개만 유지됩니다.
Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
"targetUserId": 0
}
Responses
Code Description Links
200
OK

Media type

_/_
Controls Accept header.
Example Value
Schema
{
"isSuccess": true,
"code": "string",
"message": "string",
"result": {
"chatRoomId": 0
}
}
No links

GET
/chat/rooms/{roomId}/messages
채팅 내역 조회 (cursor 기반 무한 스크롤)

특정 채팅방의 상대 정보 + 메시지 히스토리를 조회합니다. 메시지는 항상 시간 오름차순(과거 → 최신)으로 반환되며, 위로 스크롤하는 방식의 cursor 기반 무한 스크롤에 맞춰져 있습니다.

🔰 1) 최초 호출 (가장 최근 메시지 불러오기)

cursorMessageId 없이 호출합니다. (null)
예) GET /chat/rooms/{roomId}/messages?size=20
해당 채팅방의 가장 최신 메시지들 중 최대 size개를 내려줍니다.
응답의 messages 배열에서 맨 아래에 있는 메시지가 가장 최신 메시지입니다.
최초 진입 시, 서버에서 상대가 보낸 안읽은 메시지를 모두 읽음 처리합니다.
🔁 2) 과거 메시지 더 불러오기 (위로 스크롤)

프론트에서 현재 화면에 보여지고 있는 메시지들 중 가장 위에 있는(가장 오래된) 메시지의 messageId를 cursorMessageId로 보냅니다.

예)

현재 화면에서 가장 위 메시지의 ID가 40이라면 → GET /chat/rooms/{roomId}/messages?cursorMessageId=40&size=20
서버는 id < cursorMessageId 인 메시지 중에서 더 과거의 메시지를 최대 size개 반환합니다.

📤 Response (ChatRoomDetailResponse)

roomId : 채팅방 ID

opponent : 상대방 유저 정보 (userId, name, profileImageUrl, role)

messages[] : 조회된 메시지 리스트 (오래된 메시지 → 최신 메시지)

messageId : 채팅 메시지 ID
senderUserId : 보낸 사람 User ID
messageType : TEXT / IMAGE
message : 텍스트 내용 / "이미지" (IMAGE 타입일 때)
imageUrls : IMAGE 타입일 때 S3 URL 리스트
createdAt : 메시지 생성 시간
isRead : 현재 유저 기준으로 이 메시지가 읽음 처리되었는지 여부
nextCursorMessageId :

이번에 내려준 messages 중 가장 오래된 메시지의 ID
다음 요청 시 cursorMessageId로 그대로 넘겨주면 됩니다.
hasNext :

true : 아직 더 과거 메시지가 남아 있음 (스크롤 계속 가능)
false : 더 이상 불러올 메시지가 없음 (채팅의 시작 지점)
lastReadMessageId :

현재 유저가 읽은 상대 메시지들 중, 가장 마지막 메시지의 ID
프론트에서 "내가 어디까지 읽었는지" 기준으로 사용하면 됩니다.
Parameters
Try it out
Name Description
roomId \*
integer($int64)
(path)
roomId
cursorMessageId
integer($int64)
(query)
cursorMessageId
size
integer($int32)
(query)
Default value : 20

20
Responses
Code Description Links
200
OK

Media type

_/_
Controls Accept header.
Example Value
Schema
{
"isSuccess": true,
"code": "string",
"message": "string",
"result": {
"roomId": 0,
"opponent": {
"userId": 0,
"name": "string",
"profileImageUrl": "string",
"role": "DESIGNER"
},
"messages": [
{
"messageId": 0,
"senderUserId": 0,
"messageType": "TEXT",
"message": "string",
"imageUrls": [
"string"
],
"createdAt": "2025-12-21T04:03:45.851Z",
"read": true
}
],
"nextCursorMessageId": 0,
"hasNext": true,
"lastReadMessageId": 0
}
}
