import type { Metadata } from 'next';
import '@/src/styles/globals.css';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { Toaster } from 'sonner';

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
        <Toaster
          position="bottom-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: 'bg-black text-white text-body-2-medium px-6 py-3 rounded-full shadow-lg',
              title: 'text-white',
              description: 'text-white',
            },
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
