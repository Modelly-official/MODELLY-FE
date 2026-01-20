import { cache } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/src/providers/queryClient';
import { getRecruitmentDetail } from '@/src/apis';
import { recruitmentKeys } from '@/src/hooks/queries/explore';
import { PostDetailContent } from '@/src/components/post';

// React cache로 래핑하여 동일 요청 중복 방지
const getCachedRecruitmentDetail = cache((id: number, accessToken?: string) =>
  getRecruitmentDetail(id, accessToken)
);

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

// SEO 메타데이터 동적 생성
export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const recruitmentId = parseInt(id, 10);

  if (isNaN(recruitmentId)) {
    return {
      title: '공고를 찾을 수 없습니다 | Moandi',
    };
  }

  try {
    // SSR에서 쿠키로 토큰 전달 (isLiked 등 인증 필요 데이터용)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const response = await getCachedRecruitmentDetail(recruitmentId, accessToken);
    const detail = response.result;

    // Null safety 처리
    const title = detail?.title ?? '공고 상세';
    const content = detail?.content ?? '';
    const imageUrls = detail?.imageUrls ?? [];

    return {
      title: `${title} | Moandi`,
      description: content.slice(0, 150),
      openGraph: {
        title,
        description: content.slice(0, 150),
        images: imageUrls.length > 0 ? [imageUrls[0]] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: content.slice(0, 150),
        images: imageUrls.length > 0 ? [imageUrls[0]] : [],
      },
    };
  } catch {
    return {
      title: '공고를 찾을 수 없습니다 | Moandi',
    };
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const recruitmentId = parseInt(id, 10);

  // 유효하지 않은 ID
  if (isNaN(recruitmentId)) {
    notFound();
  }

  // SSR에서 쿠키로 토큰 전달 (isLiked 등 인증 필요 데이터용)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const queryClient = getQueryClient();

  // SSR에서 데이터 프리페치 (캐시된 함수 사용으로 중복 요청 방지)
  await queryClient.prefetchQuery({
    queryKey: recruitmentKeys.detail(recruitmentId),
    queryFn: () => getCachedRecruitmentDetail(recruitmentId, accessToken),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailContent recruitmentId={recruitmentId} />
    </HydrationBoundary>
  );
}
