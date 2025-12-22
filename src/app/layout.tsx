import type { Metadata } from 'next';
import '@/src/styles/globals.css';
import { QueryProvider } from '@/src/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Monde',
  description: '모델과 디자이너 매칭 플랫폼',
  icons: {
    icon: '/images/favicon.svg',
  },
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
          <div className="mx-auto min-h-screen w-full overflow-x-hidden sm:w-[375px] sm:shadow-2xl">{children}</div>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
