'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/arrow-left.svg';
import PortfolioForm from '@/src/components/mypage/portfolio/PortfolioForm';
import { useToast } from '@/src/hooks/common/useToast';
import { useCreatePortfolio } from '@/src/hooks/queries';
import { uploadPortfolioImages } from '@/src/apis';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useDesignerProfile } from '@/src/hooks/queries/mypage';
import { getSubCategoryOptions } from '@/src/constants/explore';
import { categoryNameToCode } from '@/src/utils/myRecruitment/category';
import type { CreatePortfolioRequest, SubCategory } from '@/src/types';

export default function PortfolioCreatePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutateAsync: createPortfolio } = useCreatePortfolio();
  const { user, cookieCategory } = useAuthReady();
  const baseCategory = user?.category ?? cookieCategory ?? null;
  const { data: profileData } = useDesignerProfile(!baseCategory);
  const profileCategory = profileData?.result?.category ? categoryNameToCode(profileData.result.category) : null;
  const designerCategory = baseCategory ?? profileCategory;

  const subCategoryOptions = useMemo(() => {
    if (!designerCategory) return [];
    return getSubCategoryOptions(designerCategory).map((option) => ({
      value: option.code,
      label: option.name,
    }));
  }, [designerCategory]);

  const handleSubmit = async (payload: {
    title: string;
    description: string;
    imageFile: File | null;
    imagePreviewUrl: string | null;
    subCategory: string;
  }) => {
    if (!payload.imageFile) {
      showToast('이미지를 업로드해주세요.');
      return;
    }

    let uploadResult;
    try {
      uploadResult = await uploadPortfolioImages([payload.imageFile]);
    } catch {
      showToast('이미지 업로드에 실패했습니다.');
      return;
    }

    const request: CreatePortfolioRequest = {
      title: payload.title,
      thumbnail: uploadResult.thumbnail,
      folderId: uploadResult.folderId,
      imageUrls: uploadResult.imageUrls,
      content: payload.description,
      subCategoryList: [payload.subCategory as SubCategory],
    };

    try {
      await createPortfolio(request);
      router.push('/mypage/portfolio');
    } catch {
      // useCreatePortfolio에서 토스트 처리
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-13 items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.push('/mypage/portfolio')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <LeftArrowIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">포트폴리오 등록</h1>
        <div className="size-6" />
      </header>

      <div className="flex flex-1 flex-col px-4 pt-1 pb-[calc(180px+env(safe-area-inset-bottom))]">
        <PortfolioForm submitLabel="등록하기" subCategoryOptions={subCategoryOptions} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
