import type { Metadata, Viewport } from 'next';
import '@/src/styles/globals.css';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { ToastProvider } from '@/src/providers/ToastProvider';
import { FCMProvider } from '@/src/providers/FCMProvider';

export const metadata: Metadata = {
  title: 'Monde',
  description: '모델과 디자이너 매칭 플랫폼',
  icons: {
    icon: '/images/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Monde',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#00000000',
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
            <FCMProvider>
              <div className="mx-auto min-h-screen w-full min-w-[375px] overflow-x-hidden sm:w-[375px] sm:shadow-2xl">{children}</div>
            </FCMProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
