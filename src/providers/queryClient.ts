import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 데이터가 60초간 fresh 상태로 유지
        staleTime: 60 * 1000,
        // 5분간 캐시 유지
        gcTime: 5 * 60 * 1000,
        // 실패한 요청은 1번만 재시도
        retry: 1,
      },
      mutations: {
        // mutation은 재시도 X (중복 요청 방지)
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새로운 query client 생성
    return makeQueryClient();
  } else {
    // 브라우저: 없으면 새로 만들고, 있으면 재사용
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
