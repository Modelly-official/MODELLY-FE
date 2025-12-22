import SearchIcon from '@/public/icons/chat/search.svg';

// 아직 구현은 안함 - UI만
export default function ChatSearch() {
  return (
    <div className="mx-4 mt-2 mb-[5px] flex items-center rounded-xl bg-gray-200 px-4 py-3.5">
      <SearchIcon />
      <input
        type="text"
        placeholder="검색하기"
        className="text-body-2-medium w-full bg-transparent pl-2 text-black placeholder-gray-700 outline-none"
      />
    </div>
  );
}
