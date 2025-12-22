import type { Metadata, Viewport } from 'next';
import '@/src/styles/globals.css';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { ToastProvider } from '@/src/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'Monde',
  description: '모델과 디자이너 매칭 플랫폼',
  icons: {
    icon: '/images/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Monde',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
            <div className="mx-auto min-h-screen w-full overflow-x-hidden sm:w-[375px] sm:shadow-2xl">{children}</div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
