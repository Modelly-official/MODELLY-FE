'use client';

import CheckSmallIcon from '@/public/icons/myRecruitment/form/check-small.svg';

interface AgreementCheckboxesProps {
  agreeVideo: boolean;
  agreeInsta: boolean;
  agreeMosaic: boolean;
  onAgreeVideoChange: (agree: boolean) => void;
  onAgreeInstaChange: (agree: boolean) => void;
  onAgreeMosaicChange: (agree: boolean) => void;
}

export default function AgreementCheckboxes({
  agreeVideo,
  agreeInsta,
  agreeMosaic,
  onAgreeVideoChange,
  onAgreeInstaChange,
  onAgreeMosaicChange,
}: AgreementCheckboxesProps) {
  const agreements = [
    {
      key: 'video',
      label: '촬영 동의',
      description: '시술 과정 영상 촬영에 동의합니다',
      checked: agreeVideo,
      onChange: onAgreeVideoChange,
    },
    {
      key: 'insta',
      label: '인스타 업로드 동의',
      description: '시술 결과물 인스타그램 업로드에 동의합니다',
      checked: agreeInsta,
      onChange: onAgreeInstaChange,
    },
    {
      key: 'mosaic',
      label: '모자이크 처리 동의',
      description: '얼굴 모자이크 처리 후 사용에 동의합니다',
      checked: agreeMosaic,
      onChange: onAgreeMosaicChange,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">동의 항목</span>
      </div>

      {/* 체크박스들 */}
      <div className="flex flex-col gap-3">
        {agreements.map((agreement) => (
          <button
            key={agreement.key}
            type="button"
            onClick={() => agreement.onChange(!agreement.checked)}
            className="flex cursor-pointer items-start gap-3"
          >
            <div
              className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                agreement.checked ? 'bg-purple-500' : 'bg-gray-200'
              }`}
            >
              <CheckSmallIcon className={agreement.checked ? 'text-white' : 'text-gray-500'} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-body-2-medium text-gray-900">{agreement.label}</span>
              <span className="text-caption-1-medium text-gray-600">{agreement.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
