'use client';

interface DesignerProfileIntroProps {
  intro: string;
}

export default function DesignerProfileIntro({ intro }: DesignerProfileIntroProps) {
  return (
    <div>
      <div className="flex flex-col gap-2.5 rounded-2xl bg-gray-100 px-4 py-4">
        <h2 className="text-body-2-regular text-gray-700">한 줄 소개</h2>
        <p className="text-body-2-medium whitespace-pre-line text-gray-900">{intro}</p>
      </div>
    </div>
  );
}
