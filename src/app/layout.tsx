import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Modelly",
  description: "모델과 디자이너 매칭 플랫폼",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white">
        <div className="w-[375px] mx-auto min-h-screen overflow-x-hidden shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
