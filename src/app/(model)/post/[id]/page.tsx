import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/src/lib/queryClient';
import { getRecruitmentDetail } from '@/src/apis';
import { recruitmentKeys } from '@/src/hooks/queries/explore';
import { PostDetailContent } from '@/src/components/post';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

// SEO 메타데이터 동적 생성
export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const recruitmentId = parseInt(id, 10);

  if (isNaN(recruitmentId)) {
    return {
      title: '공고를 찾을 수 없습니다 | MODELLY',
    };
  }

  try {
    const response = await getRecruitmentDetail(recruitmentId);
    const detail = response.result;

    return {
      title: `${detail.title} | MODELLY`,
      description: detail.content.slice(0, 150),
      openGraph: {
        title: detail.title,
        description: detail.content.slice(0, 150),
        images: detail.imageUrls.length > 0 ? [detail.imageUrls[0]] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: detail.title,
        description: detail.content.slice(0, 150),
        images: detail.imageUrls.length > 0 ? [detail.imageUrls[0]] : [],
      },
    };
  } catch {
    return {
      title: '공고를 찾을 수 없습니다 | MODELLY',
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

  const queryClient = getQueryClient();

  // SSR에서 데이터 프리페치
  await queryClient.prefetchQuery({
    queryKey: recruitmentKeys.detail(recruitmentId),
    queryFn: () => getRecruitmentDetail(recruitmentId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailContent recruitmentId={recruitmentId} />
    </HydrationBoundary>
  );
}
