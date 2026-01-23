import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/src/providers/queryClient';
import { getRecruitments } from '@/src/apis';
import { recruitmentKeys } from '@/src/hooks/queries/explore/useRecruitments';
import { ExploreContent } from '@/src/components/explore';

export default async function ExplorePage() {
  const queryClient = getQueryClient();

  // SSR에서 쿠키로 토큰 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  // 서버에서 초기 데이터 프리페칭 (기본값: HAIR 카테고리, 최신순)
  await queryClient.prefetchInfiniteQuery({
    queryKey: recruitmentKeys.list({
      category: 'HAIR',
      sortOption: 'NEWEST',
    }),
    queryFn: () =>
      getRecruitments(
        { category: 'HAIR', sortOption: 'NEWEST' },
        { accessToken }
      ),
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreContent />
    </HydrationBoundary>
  );
}
