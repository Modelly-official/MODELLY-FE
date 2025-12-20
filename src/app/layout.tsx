import type { Metadata } from 'next';
import '@/src/styles/globals.css';
import { QueryProvider } from '@/src/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Monde',
  description: '모델과 디자이너 매칭 플랫폼',
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
          <div className="w-[375px] mx-auto min-h-screen overflow-x-hidden shadow-2xl">{children}</div>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
