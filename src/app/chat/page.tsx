import ChatList from "@/src/components/chat/chatlist/ChatList";

export default function ChatPage() {
  return (
    <div className="bg-white min-h-screen">
      <h1 className="text-head-3-semibold mt-11 px-5 py-[13px]">채팅</h1>
        <ChatList />
    </div>
  );
}