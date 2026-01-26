'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/arrow-left.svg';
import PortfolioForm from '@/src/components/mypage/portfolio/PortfolioForm';
import { mockPortfolioItems } from '@/src/mocks/portfolio';
import { useToast } from '@/src/hooks/common/useToast';
import { useUpdatePortfolio } from '@/src/hooks/queries';
import { uploadPortfolioImages } from '@/src/apis';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useDesignerProfile } from '@/src/hooks/queries/mypage';
import { getSubCategoryOptions } from '@/src/constants/explore';
import { categoryNameToCode } from '@/src/utils/myRecruitment/category';
import type { UpdatePortfolioRequest, SubCategory } from '@/src/types';

export default function PortfolioEditPage() {
  const router = useRouter();
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const numericId = Number(portfolioId);
  const portfolioItem = mockPortfolioItems.find((item) => item.id === numericId);

  const { showToast } = useToast();
  const { mutateAsync: updatePortfolio } = useUpdatePortfolio();
  const { user, cookieCategory } = useAuthReady();
  const baseCategory = user?.category ?? cookieCategory ?? null;
  const { data: profileData } = useDesignerProfile(!baseCategory);
  const profileCategory = profileData?.result?.category
    ? categoryNameToCode(profileData.result.category)
    : null;
  const designerCategory = baseCategory ?? profileCategory;

  const subCategoryOptions = useMemo(() => {
    if (!designerCategory) return [];
    return getSubCategoryOptions(designerCategory).map((option) => ({
      value: option.code,
      label: option.name,
    }));
  }, [designerCategory]);

  if (!portfolioItem) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <header className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => router.push('/mypage/portfolio')}
            className="flex size-6 cursor-pointer items-center justify-center"
            aria-label="뒤로가기"
          >
            <LeftArrowIcon className="size-6" />
          </button>
          <h1 className="text-head-4-medium text-center text-black">포트폴리오 수정</h1>
          <div className="size-6" />
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-2-medium text-gray-700">포트폴리오를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (payload: {
    title: string;
    description: string;
    imageFile: File | null;
    imagePreviewUrl: string | null;
    subCategory: string;
  }) => {
    let request: UpdatePortfolioRequest;

    if (payload.imageFile) {
      let uploadResult;
      try {
        uploadResult = await uploadPortfolioImages([payload.imageFile]);
      } catch {
        showToast('이미지 업로드에 실패했습니다.');
        return;
      }

      request = {
        title: payload.title,
        thumbnail: uploadResult.thumbnail,
        folderId: uploadResult.folderId,
        imageUrls: uploadResult.imageUrls,
        content: payload.description,
        subCategoryList: [payload.subCategory as SubCategory],
      };
    } else if (payload.imagePreviewUrl && !payload.imagePreviewUrl.startsWith('blob:')) {
      request = {
        title: payload.title,
        thumbnail: payload.imagePreviewUrl,
        // TODO: 상세 조회 API에서 folderId를 받아올 수 있으면 교체
        folderId: '',
        imageUrls: [payload.imagePreviewUrl],
        content: payload.description,
        subCategoryList: [payload.subCategory as SubCategory],
      };
    } else {
      showToast('이미지를 업로드해주세요.');
      return;
    }

    try {
      await updatePortfolio({ portfolioId: numericId, request });
      router.push('/mypage/portfolio');
    } catch {
      // useUpdatePortfolio에서 토스트 처리
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
        <h1 className="text-head-4-medium text-center text-black">포트폴리오 수정</h1>
        <div className="size-6" />
      </header>

      <div className="flex flex-1 flex-col px-4 pt-1 pb-[calc(180px+env(safe-area-inset-bottom))]">
        <PortfolioForm
          submitLabel="수정하기"
          subCategoryOptions={subCategoryOptions}
          initialTitle={portfolioItem.title}
          initialDescription={portfolioItem.description}
          initialImageUrl={portfolioItem.imageUrl}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
