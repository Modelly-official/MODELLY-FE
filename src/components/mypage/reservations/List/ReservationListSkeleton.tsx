export default function ReservationListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* 전체 개수 스켈레톤 */}
      <div className="animate-skeleton h-5 w-20 rounded bg-gray-300" />

      {/* 카드 스켈레톤 */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-4 rounded-[20px] bg-white px-5 py-4">
          {/* 뱃지 스켈레톤 */}
          <div className="flex gap-1">
            <div className="animate-skeleton h-6 w-12 rounded-lg bg-gray-300" />
            <div className="animate-skeleton h-6 w-10 rounded-lg bg-gray-300" />
          </div>

          {/* 제목 스켈레톤 */}
          <div className="animate-skeleton h-7 w-3/4 rounded bg-gray-300" />

          {/* 정보 스켈레톤 */}
          <div className="flex flex-col gap-2">
            <div className="animate-skeleton h-5 w-full rounded bg-gray-300" />
            <div className="animate-skeleton h-5 w-2/3 rounded bg-gray-300" />
            <div className="animate-skeleton h-5 w-1/2 rounded bg-gray-300" />
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="flex gap-2">
            <div className="animate-skeleton h-[41px] w-24 rounded-full bg-gray-300" />
            <div className="animate-skeleton h-[41px] w-20 rounded-full bg-gray-300" />
            <div className="animate-skeleton h-[41px] w-20 rounded-full bg-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
}
