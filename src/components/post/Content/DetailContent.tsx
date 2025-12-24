'use client';

import { ServiceTags, AvailableDates, InfoSection } from '.';
import type { RecruitmentDetail } from '@/src/types';

interface DetailContentProps {
  detail: RecruitmentDetail;
}

export default function DetailContent({ detail }: DetailContentProps) {
  // 목적 배열 생성
  const goals = [detail.goal1, detail.goal2, detail.goal3].filter(Boolean);

  return (
    <div className="flex flex-col gap-2 bg-gray-100 px-4 py-4">
      {/* 시술 내용 */}
      <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-body-2-semibold text-gray-900">시술 내용</h3>
          <ServiceTags services={detail.subCategories} />
        </div>
        <div className="rounded-lg bg-gray-100 px-4 py-3">
          <p className="text-body-2-medium whitespace-pre-wrap text-black">{detail.content}</p>
        </div>
      </div>

      {/* 시술 가능한 날짜 */}
      <div className="flex flex-col gap-2 overflow-hidden rounded-lg bg-white p-4">
        <h3 className="text-body-2-semibold text-gray-900">시술 가능한 날짜</h3>
        <AvailableDates schedules={detail.recruitmentSchedule} />
      </div>

      {/* 모델 모집 목적 */}
      {goals.length > 0 && (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
          <h3 className="text-body-2-semibold text-gray-900">모델 모집 목적</h3>
          {goals.map((goal, index) => (
            <InfoSection key={index} title="" content={goal} hasIcon />
          ))}
        </div>
      )}

      {/* 전달사항 */}
      {detail.etc && (
        <div className="rounded-lg bg-white p-4">
          <InfoSection title="기타" content={detail.etc} hasIcon={false} />
        </div>
      )}

      {/* 유의사항 */}
      {detail.notice && (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
          <h3 className="text-body-2-semibold text-gray-900">유의사항</h3>
          <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
            <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gray-800">
              <span className="text-caption-1-medium text-white">✕</span>
            </div>
            <p className="text-body-2-medium flex-1 whitespace-pre-line text-black">{detail.notice}</p>
          </div>
        </div>
      )}

      {/* 사전 동의사항 */}
      {(detail.agreeVideo || detail.agreeInsta || detail.agreeMosaic) && (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
          <h3 className="text-body-2-semibold text-gray-900">사전 동의사항</h3>
          {detail.agreeVideo && <InfoSection title="" content="영상 촬영 및 활용" hasIcon />}
          {detail.agreeInsta && <InfoSection title="" content="인스타 업로드" hasIcon />}
          {detail.agreeMosaic && <InfoSection title="" content="모자이크 처리" hasIcon />}
        </div>
      )}
    </div>
  );
}
