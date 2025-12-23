'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  PostHeader,
  ImageGallery,
  DesignerInfo,
  PostTabs,
  DetailContent,
  PostActions,
} from '@/src/components/post';
import { mockRecruitmentDetail, mockRecruitmentDetail2 } from '@/src/mocks/explore';

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'review'>('detail');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock 데이터에서 해당 ID의 공고 찾기
  const postId = parseInt(params.id);
  const detail = postId === 1 ? mockRecruitmentDetail : postId === 2 ? mockRecruitmentDetail2 : null;

  if (!detail) {
    notFound();
  }

  const handleFavoriteClick = () => {
    // TODO: 찜하기 API 연동 (추후 구현)
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 (뒤로가기) */}
      <PostHeader />

      {/* 이미지 갤러리 */}
      <ImageGallery images={detail.images} />

      {/* 제목 및 찜하기 */}
      <div className="flex items-start justify-between gap-4 px-4 pt-4">
        <h1 className="flex-1 text-head-2-semibold text-gray-900">{detail.title}</h1>
        <button type="button" onClick={handleFavoriteClick} className="flex size-6 shrink-0 items-center justify-center">
          <Image
            src={isFavorite ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
            alt="찜하기"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 디자이너 정보 */}
      <div className="px-4 pt-2">
        <DesignerInfo
          designerId={detail.designer.id}
          designerName={detail.designer.name}
          shopName={detail.designer.shopName}
          location={detail.designer.location}
          rating={detail.designer.rating}
          reviewCount={detail.designer.reviewCount}
        />
      </div>

      {/* 탭 */}
      <div className="mt-6">
        <PostTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 탭 내용 */}
      {activeTab === 'detail' ? (
        <DetailContent detail={detail} />
      ) : (
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-body-2-medium text-gray-600">디자이너 리뷰는 추후 구현 예정입니다.</p>
        </div>
      )}

      {/* 하단 액션 버튼 (채팅하기 / 예약하기) */}
      <div className="h-[88px]" /> {/* 하단 버튼 영역 공간 확보 */}
      <PostActions recruitmentId={detail.id} designerId={detail.designer.id} />
    </div>
  );
}

