export default function WrittenReviewListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* 월 헤더 스켈레톤 */}
      <div className="animate-skeleton h-6 w-12 rounded bg-gray-300" />

      {/* 카드 스켈레톤 */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          {/* 날짜 영역 스켈레톤 */}
          <div className="flex w-6 shrink-0 flex-col items-center gap-1">
            <div className="animate-skeleton h-5 w-5 rounded bg-gray-300" />
            <div className="animate-skeleton h-4 w-4 rounded bg-gray-300" />
          </div>

          {/* 카드 영역 스켈레톤 */}
          <div className="flex flex-1 gap-3 rounded-[20px] bg-white p-4">
            {/* 썸네일 스켈레톤 */}
            <div className="animate-skeleton size-[72px] shrink-0 rounded-lg bg-gray-300" />

            {/* 내용 스켈레톤 */}
            <div className="flex flex-1 flex-col gap-2">
              {/* 뱃지 스켈레톤 */}
              <div className="flex gap-1">
                <div className="animate-skeleton h-5 w-12 rounded-lg bg-gray-300" />
                <div className="animate-skeleton h-5 w-10 rounded-lg bg-gray-300" />
              </div>

              {/* 이름 스켈레톤 */}
              <div className="animate-skeleton h-5 w-24 rounded bg-gray-300" />

              {/* 별점 스켈레톤 */}
              <div className="animate-skeleton h-4 w-20 rounded bg-gray-300" />

              {/* 내용 스켈레톤 */}
              <div className="animate-skeleton h-10 w-full rounded bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
