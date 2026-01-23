import type { Metadata, Viewport } from 'next';
import '@/src/styles/globals.css';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { ToastProvider } from '@/src/providers/ToastProvider';
import { AuthErrorHandler } from '@/src/providers/AuthErrorHandler';
import { FCMProvider } from '@/src/providers/FCMProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://moandi.co.kr'),
  title: 'Moandi',
  description: '모델과 디자이너, 서로에게 필요한 기회를 연결해주는 올인원 매칭 플랫폼',
  icons: {
    icon: '/images/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Moandi',
  },
  openGraph: {
    title: 'Moandi',
    description: '모델과 디자이너, 서로에게 필요한 기회를 연결해주는 올인원 매칭 플랫폼',
    url: '/',
    siteName: 'Moandi',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moandi',
    description: '모델과 디자이너, 서로에게 필요한 기회를 연결해주는 올인원 매칭 플랫폼',
    images: ['/images/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
  viewportFit: 'cover',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white">
        <QueryProvider>
          <ToastProvider>
            <AuthErrorHandler>
              <FCMProvider>
                <div className="mx-auto min-h-screen w-full min-w-[375px] overflow-x-hidden sm:w-[375px] sm:shadow-2xl">{children}</div>
              </FCMProvider>
            </AuthErrorHandler>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
