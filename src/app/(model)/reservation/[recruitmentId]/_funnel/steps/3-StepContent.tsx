'use client';

import { ReservationHeader } from '@/src/components/reservation';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';

const MAX_LENGTH = 100;

interface StepContentProps {
  goNext: () => void;
  goPrev: () => void;
}

export default function StepContent({ goNext, goPrev }: StepContentProps) {
  const { comment, setComment } = useReservationStore();

  // 글자수 제한 처리
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setComment(value);
    }
  };

  // 다음 버튼 활성화 조건 (내용이 있을 때)
  const canProceed = comment.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ReservationHeader onBack={goPrev} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-6 px-4">
        {/* 스텝 정보 */}
        <div className="flex flex-col gap-2">
          <p className="text-[20px] leading-[1.4] font-normal tracking-[-0.4px]">
            <span className="text-gray-900">3</span>
            <span className="text-gray-600">/4</span>
          </p>

          <div className="flex flex-col gap-2">
            <h1 className="text-head-2-semibold text-gray-900">
              최근 시술 이력이나
              <br />
              희망 시술을 작성해주세요.
            </h1>
            <p className="text-body-2-medium text-gray-600">디자이너가 시술을 준비하는 데 도움이 됩니다.</p>
          </div>
        </div>

        {/* 텍스트 입력 */}
        <div className="relative">
          <textarea
            value={comment}
            onChange={handleChange}
            placeholder={`최근 1년 내 시술 이력을 상세히 작성해주세요.\n원하는 시술을 함께 작성해주시면 참고용으로 활용됩니다.`}
            className="text-body-2-medium h-[260px] w-full resize-none rounded-[16px] bg-gray-100 p-4 pb-10 text-gray-900 placeholder:text-gray-600 focus:outline-none"
          />
          {/* 글자 수 표시 */}
          <p className="text-body-2-medium absolute right-4 bottom-4 text-gray-600">
            {comment.length}/{MAX_LENGTH}
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className={`text-body-1-semibold h-14 w-full rounded-full transition-colors ${
            canProceed ? 'cursor-pointer bg-gray-900 text-white' : 'cursor-not-allowed bg-gray-200 text-gray-600'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
