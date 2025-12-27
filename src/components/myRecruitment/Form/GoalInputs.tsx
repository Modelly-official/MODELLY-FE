'use client';

interface GoalInputsProps {
  goals: [string, string, string];
  onGoalChange: (index: 0 | 1 | 2, value: string) => void;
  maxLength?: number;
}

export default function GoalInputs({ goals, onGoalChange, maxLength = 50 }: GoalInputsProps) {
  const handleChange = (index: 0 | 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onGoalChange(index, newValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">시술 목표</span>
      </div>
      <span className="text-body-2-regular text-gray-600">
        이번 시술에서 기대하는 목표를 입력해 주세요
      </span>

      {/* 목표 입력 필드들 */}
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative">
            <input
              type="text"
              value={goals[index as 0 | 1 | 2]}
              onChange={handleChange(index as 0 | 1 | 2)}
              placeholder={`목표 ${index + 1}`}
              className="text-body-2-medium h-12 w-full rounded-xl bg-gray-100 px-4 text-gray-900 placeholder:text-gray-500 focus:placeholder:text-transparent focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
