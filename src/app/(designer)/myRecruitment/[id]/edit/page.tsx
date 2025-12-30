'use client';

import { use } from 'react';

import EditRecruitmentFunnel from './_funnel/EditRecruitmentFunnel';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditRecruitmentPage({ params }: PageProps) {
  const { id } = use(params);
  const recruitmentId = Number(id);

  if (isNaN(recruitmentId)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-body-1-medium text-gray-600">잘못된 공고 ID입니다.</p>
      </div>
    );
  }

  return <EditRecruitmentFunnel recruitmentId={recruitmentId} />;
}
