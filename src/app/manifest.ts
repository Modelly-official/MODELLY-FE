import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // 앱 이름 설정
    name: 'Moandi',
    short_name: 'Moandi',
    // 앱 설명
    description: '모델과 디자이너, 서로에게 필요한 기회를 연결해주는 올인원 매칭 플랫폼',
    // 시작 URL
    start_url: '/',
    // 표시 모드: standalone은 네이티브 앱처럼 표시
    display: 'standalone',
    // 배경색 (theme.css의 white)
    background_color: '#ffffff',
    // 테마 컬러 (theme.css의 white)
    theme_color: '#00000000',
    // PWA 아이콘 설정
    icons: [
      {
        src: '/icons/app/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/app/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
