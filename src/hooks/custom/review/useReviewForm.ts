'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateReview } from '@/src/hooks/queries/review';
import { uploadReviewImages } from '@/src/apis';
import type { UnreviewedReservation } from '@/src/types';

// 상수
const MAX_CONTENT_LENGTH = 100;
const MIN_CONTENT_LENGTH = 10;
const MAX_IMAGES = 3;

interface UseReviewFormOptions {
  reservationId: number;
  reservation?: UnreviewedReservation;
}

interface UseReviewFormReturn {
  // 폼 상태
  rating: number;
  setRating: (rating: number) => void;
  content: string;
  setContent: (content: string) => void;
  previewUrls: string[];

  // 유효성
  isValidForm: boolean;
  isSubmitting: boolean;

  // 이미지 핸들러
  handleImagesAdd: (files: File[]) => void;
  handleImageRemove: (index: number) => void;

  // 제출
  handleSubmit: () => Promise<void>;

  // 상수
  maxContentLength: number;
  minContentLength: number;
  maxImages: number;
}

/**
 * 리뷰 작성 폼 로직을 관리하는 커스텀 훅
 * - 폼 상태 관리 (rating, content, images)
 * - 이미지 미리보기 관리
 * - 유효성 검사
 * - 이미지 업로드 + 리뷰 작성 제출
 */
export function useReviewForm({
  reservationId,
}: UseReviewFormOptions): UseReviewFormReturn {
  const router = useRouter();
  const createReviewMutation = useCreateReview();

  // 폼 상태
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 유효성 검사
  const isValidForm = useMemo(() => {
    return (
      rating > 0 &&
      content.length >= MIN_CONTENT_LENGTH &&
      content.length <= MAX_CONTENT_LENGTH
    );
  }, [rating, content]);

  // 이미지 추가 핸들러
  const handleImagesAdd = useCallback((files: File[]) => {
    setImageFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...files].slice(0, MAX_IMAGES);

      // 미리보기 URL 생성 (이전 URL들은 컴포넌트에서 cleanup)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      // 이전 URL들 해제
      setPreviewUrls((prevUrls) => {
        prevUrls.forEach((url) => URL.revokeObjectURL(url));
        return newPreviews;
      });

      return newFiles;
    });
  }, []);

  // 이미지 삭제 핸들러
  const handleImageRemove = useCallback((index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    setPreviewUrls((prevUrls) => {
      URL.revokeObjectURL(prevUrls[index]);
      return prevUrls.filter((_, i) => i !== index);
    });
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async () => {
    if (!isValidForm || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. 이미지 업로드
      const uploadResult = await uploadReviewImages(reservationId, imageFiles);

      // 2. 리뷰 작성 API 호출
      await createReviewMutation.mutateAsync({
        reservationId,
        data: {
          rating,
          content,
          ...(uploadResult && {
            thumbnail: uploadResult.thumbnail,
            imageUrlList: uploadResult.imageUrls,
            imageFolderId: uploadResult.imageFolderId,
          }),
        },
      });

      // 3. 성공 시 목록으로 이동
      router.push('/mypage/reviews');
    } catch (error) {
      // useCreateReview hook에서 이미 toast 표시하므로 여기서는 로깅만
      console.error('리뷰 등록 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isValidForm, isSubmitting, reservationId, imageFiles, rating, content, createReviewMutation, router]);

  return {
    // 폼 상태
    rating,
    setRating,
    content,
    setContent,
    previewUrls,

    // 유효성
    isValidForm,
    isSubmitting,

    // 이미지 핸들러
    handleImagesAdd,
    handleImageRemove,

    // 제출
    handleSubmit,

    // 상수
    maxContentLength: MAX_CONTENT_LENGTH,
    minContentLength: MIN_CONTENT_LENGTH,
    maxImages: MAX_IMAGES,
  };
}
