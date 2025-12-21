import SearchIcon from '@/public/icons/chat/search.svg';

// 아직 구현은 안함 - UI만
export default function ChatSearch() {
  return (
    <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3.5 mt-2 mb-[5px] mx-4">
      <SearchIcon />
      <input
        type="text"
        placeholder="검색하기"
        className="bg-transparent outline-none w-full pl-2 text-body-2-medium text-black placeholder-gray-700"
      />
    </div>
  );
}
