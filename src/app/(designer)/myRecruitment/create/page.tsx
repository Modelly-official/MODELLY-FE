'use client';

import { CreateRecruitmentFunnel } from './_funnel';

/**
 * 공고 등록 페이지
 * Funnel 패턴으로 Step 1 (제목/날짜/시간) → Step 2 (카테고리/내용/동의) 진행
 */
export default function CreateRecruitmentPage() {
  return <CreateRecruitmentFunnel />;
}
