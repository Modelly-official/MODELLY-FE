"use client";

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const GenderSelect: React.FC<GenderSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-900 text-body-1-medium">성별</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange("남자")}
          className={`flex-1 py-3 rounded-xl text-body-2-medium cursor-pointer ${
            value === "남자"
              ? "bg-blue-600 text-white border-none"
              : "bg-white text-gray-600 border border-gray-400"
          }`}
        >
          남자
        </button>
        <button
          type="button"
          onClick={() => onChange("여자")}
          className={`flex-1 py-3 rounded-xl text-body-2-medium cursor-pointer ${
            value === "여자"
              ? "bg-blue-600 text-white border-none"
              : "bg-white text-gray-600 border border-gray-400"
          }`}
        >
          여자
        </button>
      </div>
    </div>
  );
};

export default GenderSelect;
