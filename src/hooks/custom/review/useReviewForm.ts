'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateReview, useUpdateReview } from '@/src/hooks/queries/review';
import { useToast } from '@/src/hooks/common/useToast';
import { uploadReviewImages } from '@/src/apis';
import { prepareAllImagesAsFiles, hasImageChanges } from '@/src/utils/image';
import type { UnreviewedReservation, WrittenReviewItem } from '@/src/types';

// 상수
const MAX_CONTENT_LENGTH = 100;
const MIN_CONTENT_LENGTH = 10;
const MAX_IMAGES = 3;

// 작성 모드 옵션
interface UseReviewFormCreateOptions {
  mode?: 'create';
  reservationId: number;
  reservation?: UnreviewedReservation;
}

// 수정 모드 옵션
interface UseReviewFormEditOptions {
  mode: 'edit';
  reviewId: number;
  review?: WrittenReviewItem;
}

type UseReviewFormOptions = UseReviewFormCreateOptions | UseReviewFormEditOptions;

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
 * 리뷰 작성/수정 폼 로직을 관리하는 커스텀 훅
 * - 폼 상태 관리 (rating, content, images)
 * - 이미지 미리보기 관리
 * - 유효성 검사
 * - 이미지 업로드 + 리뷰 작성/수정 제출
 */
export function useReviewForm(options: UseReviewFormOptions): UseReviewFormReturn {
  const router = useRouter();
  const { showToast } = useToast();
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();

  const isEditMode = options.mode === 'edit';
  const isInitializedRef = useRef(false);

  // 폼 상태
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 수정 모드: 원본 이미지 URL 저장 (변경 여부 확인용)
  const originalImageUrlsRef = useRef<string[]>([]);

  // 수정 모드: 기존 리뷰 데이터로 초기화 (한 번만)
  useEffect(() => {
    if (isEditMode && options.review && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const review = options.review;
      setRating(review.rating);
      setContent(review.content);
      // 기존 이미지 URL을 previewUrls에 설정 (imageFiles는 빈 배열 유지)
      const imageUrls = review.imageList || [];
      setPreviewUrls(imageUrls);
      originalImageUrlsRef.current = imageUrls;
    }
  }, [isEditMode, options]);

  // 폼 유효성 검사
  const isValidForm = useMemo(() => {
    return (
      rating > 0 &&
      content.length >= MIN_CONTENT_LENGTH &&
      content.length <= MAX_CONTENT_LENGTH
    );
  }, [rating, content]);

  // 이미지 추가 핸들러
  const handleImagesAdd = useCallback(
    (files: File[]) => {
      // 기존 서버 URL 추출 (blob: 아닌 URL만)
      const serverUrls = previewUrls.filter((url) => !url.startsWith('blob:'));

      // 기존 blob URL들만 revoke
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      // 새 파일 배열 생성 (기존 imageFiles + 새 files)
      const newImageFiles = [...imageFiles, ...files];

      // 최대 이미지 수 체크 (기존 서버 URL 개수 포함)
      const totalCount = serverUrls.length + newImageFiles.length;
      const filesToAdd =
        totalCount > MAX_IMAGES
          ? newImageFiles.slice(0, MAX_IMAGES - serverUrls.length)
          : newImageFiles;

      // 새 blob URL 생성
      const newBlobUrls = filesToAdd.map((file) => URL.createObjectURL(file));

      // 상태 업데이트
      setImageFiles(filesToAdd);
      setPreviewUrls([...serverUrls, ...newBlobUrls]); // 기존 서버 URL + 새 blob URL
    },
    [previewUrls, imageFiles]
  );

  // 이미지 삭제 핸들러
  const handleImageRemove = useCallback(
    (index: number) => {
      const urlToRemove = previewUrls[index];

      // blob URL인 경우에만 imageFiles에서 삭제
      if (urlToRemove?.startsWith('blob:')) {
        // previewUrls에서 해당 index 이전의 blob URL 개수 = imageFiles에서의 실제 인덱스
        const blobIndexInFiles = previewUrls
          .slice(0, index)
          .filter((url) => url.startsWith('blob:')).length;

        setImageFiles((prevFiles) =>
          prevFiles.filter((_, i) => i !== blobIndexInFiles)
        );
        URL.revokeObjectURL(urlToRemove);
      }
      // 서버 URL인 경우 imageFiles는 건드리지 않음

      setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    },
    [previewUrls]
  );

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async () => {
    if (!isValidForm || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // 수정 모드
        const reviewId = (options as UseReviewFormEditOptions).reviewId;
        const reservationId = (options as UseReviewFormEditOptions).review?.reservationId;

        // 이미지 변경 여부 확인
        const imageChanged = hasImageChanges(
          originalImageUrlsRef.current,
          previewUrls,
          imageFiles
        );

        let finalImageUrls: string[] = [];
        let thumbnail = '';
        let imageFolderId: string | undefined;

        if (imageChanged && previewUrls.length > 0) {
          // 이미지가 변경됨 → 모든 이미지를 새 폴더에 재업로드
          if (!reservationId) {
            showToast('이미지를 업로드할 수 없습니다.');
            setIsSubmitting(false);
            return;
          }

          // 기존 URL은 fetch, 새 파일은 그대로 사용
          let allFiles: File[];
          try {
            allFiles = await prepareAllImagesAsFiles(previewUrls, imageFiles);
          } catch {
            showToast('기존 이미지를 불러오는 중 오류가 발생했습니다.');
            setIsSubmitting(false);
            return;
          }

          try {
            const uploadResult = await uploadReviewImages(reservationId, allFiles);
            if (uploadResult) {
              finalImageUrls = uploadResult.imageUrls;
              thumbnail = uploadResult.thumbnail;
              imageFolderId = uploadResult.imageFolderId;
            }
          } catch {
            showToast('이미지 업로드에 실패했습니다.');
            setIsSubmitting(false);
            return;
          }
        } else if (!imageChanged && previewUrls.length > 0) {
          // 이미지 변경 없음 → 기존 URL 유지, imageFolderId 전송 안함
          finalImageUrls = previewUrls;
          thumbnail = previewUrls[0] || '';
          // imageFolderId를 undefined로 두면 API 요청에서 제외됨
        }
        // previewUrls.length === 0 이면 이미지 없는 상태로 수정

        // 리뷰 수정 API 호출
        await updateReviewMutation.mutateAsync({
          reviewId,
          data: {
            rating,
            content,
            thumbnail,
            imageUrlList: finalImageUrls,
            ...(imageFolderId !== undefined && { imageFolderId }),
          },
        });
      } else {
        // 작성 모드
        const reservationId = (options as UseReviewFormCreateOptions).reservationId;

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
      }

      // 성공 시 목록으로 이동
      router.push('/mypage/reviews');
    } catch (error) {
      console.error('리뷰 처리 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isValidForm, isSubmitting, isEditMode, options, previewUrls, imageFiles, rating, content, createReviewMutation, updateReviewMutation, router, showToast]);

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
