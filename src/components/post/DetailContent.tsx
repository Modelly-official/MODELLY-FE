'use client';

import { ServiceTags, AvailableDates, InfoSection } from '.';
import type { RecruitmentDetail } from '@/src/types';

interface DetailContentProps {
  detail: RecruitmentDetail;
}

export default function DetailContent({ detail }: DetailContentProps) {
  return (
    <div className="flex flex-col gap-2 bg-gray-100 px-4 py-4">
      {/* 시술 내용 */}
      <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-body-2-semibold text-gray-900">시술 내용</h3>
          <ServiceTags services={detail.services} />
        </div>
        <div className="rounded-lg bg-gray-100 px-4 py-3">
          <p className="text-body-2-medium text-black">{detail.description}</p>
        </div>
      </div>

      {/* 시술 가능한 날짜 */}
      <div className="flex flex-col gap-2 overflow-hidden rounded-lg bg-white p-4">
        <h3 className="text-body-2-semibold text-gray-900">시술 가능한 날짜</h3>
        <AvailableDates schedules={detail.schedules} />
      </div>

      {/* 모델 모집 목적 */}
      <div className="rounded-lg bg-white p-4">
        <InfoSection title="모델 모집 목적" content={detail.purpose} />
      </div>

      {/* 전달사항 */}
      {detail.message && (
        <div className="rounded-lg bg-white p-4">
          <InfoSection title="전달사항" content={detail.message} />
        </div>
      )}

      {/* 유의사항 */}
      {detail.cautions && detail.cautions.length > 0 && (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
          <h3 className="text-body-2-semibold text-gray-900">유의사항</h3>
          {detail.cautions.map((caution, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg bg-gray-100 p-3">
              <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gray-800">
                <span className="text-caption-1-medium text-white">✕</span>
              </div>
              <p className="flex-1 text-body-2-medium text-black">{caution}</p>
            </div>
          ))}
        </div>
      )}

      {/* 사전 동의사항 */}
      {detail.agreements && detail.agreements.length > 0 && (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
          <h3 className="text-body-2-semibold text-gray-900">사전 동의사항</h3>
          {detail.agreements.map((agreement, index) => (
            <InfoSection key={index} title="" content={agreement} hasIcon />
          ))}
        </div>
      )}
    </div>
  );
}

