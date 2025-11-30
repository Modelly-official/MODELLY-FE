import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Modelly",
  description: "모델과 디자이너 매칭 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen overflow-x-hidden bg-white">
        {children}
      </body>
    </html>
  );
}
