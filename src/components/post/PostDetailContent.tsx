'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ImageGallery,
  PostTabs,
  AvailableDates,
  InfoSection,
  PostActions,
  PostPageSkeleton,
} from '@/src/components/post';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { useRecruitmentDetail } from '@/src/hooks/queries/explore';
import { useToggleRecruitmentLike } from '@/src/hooks/queries/likes';
import CheckIcon from '@/public/icons/post/check.svg';
import CloseIcon from '@/public/icons/common/close.svg';

interface PostDetailContentProps {
  recruitmentId: number;
  isOwner?: boolean; // 본인 공고 여부 (디자이너가 자기 공고 볼 때)
}

export default function PostDetailContent({ recruitmentId, isOwner = false }: PostDetailContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'detail' | 'review'>('detail');

  // Query hook
  const { data, isLoading, isError } = useRecruitmentDetail(recruitmentId);

  // Like mutation
  const { mutate: toggleLike } = useToggleRecruitmentLike();

  // 로딩 중
  if (isLoading) {
    return <PostPageSkeleton />;
  }

  // 에러 또는 데이터 없음
  if (isError || !data?.result) {
    notFound();
  }

  const detail = data.result;

  const handleFavoriteClick = () => {
    toggleLike(recruitmentId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 이미지 갤러리 */}
      <ImageGallery images={detail.imageUrls} />

      {/* 제목 및 찜하기 */}
      <div className="flex items-center justify-between gap-4 px-4 pt-4">
        <h1 className="text-head-2-semibold flex-1 text-gray-900">{detail.title}</h1>
        {!isOwner && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="flex size-6 shrink-0 items-center justify-center"
          >
            <Image
              src={detail.isLiked ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
              alt="찜하기"
              width={19}
              height={19}
            />
          </button>
        )}
      </div>

      {/* 디자이너 정보 */}
      <div className="px-4 pt-2">
        <Link href={`/designer/${detail.designerProfile.designerId}`} className="flex flex-col gap-1">
          <div className="flex w-fit items-center gap-1 rounded-lg border border-gray-400 px-2.5 py-1">
            <span className="text-body-2-medium text-black">디자이너</span>
            <span className="text-body-2-medium text-black">·</span>
            <span className="text-body-2-medium mr-1 text-black">{detail.designerProfile.shop}</span>
            <Image src="/icons/common/arrow-right.svg" alt="디자이너 정보" width={6} height={10} />
          </div>

          <div className="flex flex-col gap-1">
            {/* 위치 */}
            <div className="flex items-center gap-1">
              <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
              <span className="text-body-2-medium text-gray-900">{detail.designerProfile.shopAddress}</span>
            </div>

            {/* 별점 및 리뷰 */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <Image src="/icons/common/star.svg" alt="별점" width={16} height={16} />
                <span className="text-body-2-medium text-gray-900">5.0</span>
              </div>
              <span className="text-body-2-medium text-gray-900">·</span>
              <span className="text-body-2-medium text-gray-900">리뷰 42</span>
            </div>
          </div>
        </Link>
      </div>

      {/* 탭 */}
      <div className="mt-6">
        <PostTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 탭 내용 */}
      {activeTab === 'detail' ? (
        <div className="flex flex-col gap-2 bg-gray-100 px-4 py-4 pb-33">
          {/* 시술 내용 */}
          <div className="flex flex-col gap-2 rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-body-2-semibold text-gray-900">시술 내용</h3>
              <div className="flex gap-1">
                {detail.subCategories.map((subCategory) => (
                  <CategoryBadge key={subCategory} category={subCategory} />
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 px-4 py-3">
              <p className="text-body-2-medium whitespace-pre-wrap text-black">{detail.content}</p>
            </div>
          </div>

          {/* 시술 가능한 날짜 */}
          <div className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-white p-4">
            <h3 className="text-body-2-semibold text-gray-900">시술 가능한 날짜</h3>
            <AvailableDates schedules={detail.recruitmentSchedule} />
          </div>

          {/* 모집 목적 */}
          {(detail.goal1 || detail.goal2 || detail.goal3) && (
            <div className="rounded-2xl bg-white p-4">
              <InfoSection
                title="모델 모집 목적"
                content={[detail.goal1, detail.goal2, detail.goal3].filter(Boolean).join('\n')}
              />
            </div>
          )}

          {/* 유의사항 */}
          {detail.notice && (
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4">
              <h3 className="text-body-2-semibold text-gray-900">유의사항</h3>
              <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
                <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gray-800">
                  <CloseIcon className="text-white" />
                </div>
                <p className="text-body-2-medium flex-1 whitespace-pre-wrap text-black">{detail.notice}</p>
              </div>
            </div>
          )}

          {/* 사전 동의사항 */}
          {(detail.agreeVideo || detail.agreeInsta || detail.agreeMosaic) && (
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4">
              <h3 className="text-body-2-semibold text-gray-900">사전 동의사항</h3>
              {detail.agreeVideo && (
                <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
                  <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-purple-600">
                    <CheckIcon className="text-white" />
                  </div>
                  <p className="text-body-2-medium flex-1 text-black">영상 촬영</p>
                </div>
              )}
              {detail.agreeInsta && (
                <div className="flex items-start gap-3 rounded-2xl bg-gray-100 px-4 py-3">
                  <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-purple-600">
                    <CheckIcon className="text-white" />
                  </div>
                  <p className="text-body-2-medium flex-1 text-black">인스타 업로드</p>
                </div>
              )}
              {detail.agreeMosaic && (
                <div className="flex items-start gap-3 rounded-2xl bg-gray-100 px-4 py-3">
                  <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-purple-600">
                    <CheckIcon className="text-white" />
                  </div>
                  <p className="text-body-2-medium flex-1 text-black">모자이크 가능</p>
                </div>
              )}
            </div>
          )}

          {/* 기타 */}
          {detail.etc && (
            <div className="rounded-2xl bg-white p-4">
              <InfoSection title="기타" content={detail.etc} hasIcon={false} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8 pb-33">
          <p className="text-body-2-medium text-gray-600">디자이너 리뷰는 추후 구현 예정입니다.</p>
        </div>
      )}

      {/* 하단 액션 버튼 */}
      {isOwner ? (
        // 본인 공고: 수정하기 버튼
        <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-white px-4 py-3 sm:w-[375px]">
          <button
            type="button"
            onClick={() => router.push(`/myRecruitment/${recruitmentId}/edit`)}
            className="text-body-1-semibold h-12 w-full rounded-full bg-gray-900 text-white"
          >
            수정하기
          </button>
        </div>
      ) : (
        // 다른 사람 공고: 채팅하기 / 예약하기
        <PostActions recruitmentId={detail.recruitmentId} designerId={detail.designerProfile.designerId} />
      )}
    </div>
  );
}
