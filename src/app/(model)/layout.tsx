import { BottomNav } from '@/src/components/common';

export default function ModelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 메인 컨텐츠 - 하단 네비게이션 높이만큼 padding 추가 */}
      <main className="pb-[60px]">{children}</main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </>
  );
}
