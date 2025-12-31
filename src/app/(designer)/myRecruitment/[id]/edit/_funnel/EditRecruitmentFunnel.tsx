'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { StepTitleDate, StepContent } from '@/src/app/(designer)/myRecruitment/create/_funnel/steps';
import { useUpdateRecruitmentSubmit } from '@/src/hooks/custom/myRecruitment/useUpdateRecruitmentSubmit';
import { useRecruitmentDetail } from '@/src/hooks/queries/explore';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { categoryNameToCode, subCategoryNameToCode } from '@/src/utils/myRecruitment';
import { PURPOSE_OPTIONS } from '@/src/types/myRecruitment';
import type { RecruitmentSchedule } from '@/src/types/recruitment';
import type { PurposeType } from '@/src/types/myRecruitment';

interface EditRecruitmentFunnelProps {
  recruitmentId: number;
}

/**
 * RecruitmentDetail -> FormState 변환
 */
function convertDetailToFormState(detail: {
  title: string;
  recruitmentSchedule: RecruitmentSchedule[];
  category: string;
  subCategories: string[];
  content: string;
  notice: string; // 전달 사항
  restriction: string; // 유의사항
  goal1: string;
  imageUrls: string[];
  agreeVideo: boolean;
  agreeInsta: boolean;
  agreeMosaic: boolean;
  etc: string;
}) {
  // 날짜/시간 변환
  const selectedDates = detail.recruitmentSchedule.map((s) => s.recruitmentDate);
  const selectedTimes: Record<string, string[]> = {};
  detail.recruitmentSchedule.forEach((s) => {
    selectedTimes[s.recruitmentDate] = s.recruitmentTimes;
  });

  // 목적 변환 (goal1 -> purpose)
  let purpose: PurposeType | null = null;
  let purposeDetail = '';

  const matchedPurpose = PURPOSE_OPTIONS.find((opt) => opt.name === detail.goal1);
  if (matchedPurpose) {
    purpose = matchedPurpose.code;
  } else if (detail.goal1) {
    purpose = 'OTHER';
    purposeDetail = detail.goal1;
  }

  // 카테고리 변환 (한글 -> 코드)
  const categoryCode = categoryNameToCode(detail.category);

  // 서브카테고리 변환 (한글 -> 코드, 카테고리별로 다름)
  const subCategoryName = detail.subCategories?.[0];
  let subCategoryCode: string | null = null;
  if (subCategoryName && categoryCode) {
    subCategoryCode = subCategoryNameToCode(categoryCode, subCategoryName);
  }

  return {
    title: detail.title,
    selectedDates,
    selectedTimes,
    applyTimesToAll: false,
    content: detail.content,
    category: categoryCode,
    subCategory: subCategoryCode,
    restrictions: detail.restriction, // 유의사항
    notice: detail.notice, // 전달 사항
    purpose,
    purposeDetail,
    agreeVideo: detail.agreeVideo,
    agreeInsta: detail.agreeInsta,
    agreeMosaic: detail.agreeMosaic,
    agreeEtc: !!detail.etc,
    etc: detail.etc,
    // 기존 이미지 URL (새 파일 업로드 전까지 유지)
    imageFiles: [],
    imagePreviewUrls: detail.imageUrls || [],
    thumbnail: detail.imageUrls?.[0] || '',
    imageUrls: detail.imageUrls || [],
    imageFolderId: '',
  };
}

export default function EditRecruitmentFunnel({ recruitmentId }: EditRecruitmentFunnelProps) {
  const router = useRouter();
  const isInitializedRef = useRef(false);

  // 기존 공고 데이터 조회
  const { data, isLoading, isError } = useRecruitmentDetail(recruitmentId);
  const initForEdit = useRecruitmentFormStore((state) => state.initForEdit);

  // 제출 로직 커스텀 훅
  const { isSubmitting, handleSubmit, reset } = useUpdateRecruitmentSubmit(recruitmentId);

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (data?.result && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const formState = convertDetailToFormState(data.result);
      initForEdit(formState);
    }
  }, [data, initForEdit]);

  const [Funnel, setStep] = useFunnel(['titleDate', 'content'] as const, {
    initialStep: 'titleDate',
  });

  // 뒤로가기 (첫 스텝에서는 페이지 이탈)
  const handleBackFromTitleDate = () => {
    reset();
    router.back();
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  // 에러
  if (isError || !data?.result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-1-medium text-gray-600">공고 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Funnel>
        <Funnel.Step name="titleDate">
          <StepTitleDate goNext={() => setStep('content')} goPrev={handleBackFromTitleDate} isEdit />
        </Funnel.Step>
        <Funnel.Step name="content">
          <StepContent goNext={handleSubmit} goPrev={() => setStep('titleDate')} isSubmitting={isSubmitting} isEdit />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
