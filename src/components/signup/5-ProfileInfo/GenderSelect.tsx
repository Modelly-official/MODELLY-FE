'use client';

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const GenderSelect: React.FC<GenderSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-1-medium text-gray-900">성별</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('남자')}
          className={`text-body-2-medium flex-1 cursor-pointer rounded-xl py-3 ${
            value === '남자' ? 'border-none bg-purple-600 text-white' : 'border border-gray-400 bg-white text-gray-600'
          }`}
        >
          남자
        </button>
        <button
          type="button"
          onClick={() => onChange('여자')}
          className={`text-body-2-medium flex-1 cursor-pointer rounded-xl py-3 ${
            value === '여자' ? 'border-none bg-purple-600 text-white' : 'border border-gray-400 bg-white text-gray-600'
          }`}
        >
          여자
        </button>
      </div>
    </div>
  );
};
