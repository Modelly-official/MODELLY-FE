interface IOSInstallGuideProps {
  className?: string;
}

/**
 * iOS Safari에서 PWA 설치 안내 컴포넌트
 */
export default function IOSInstallGuide({ className }: IOSInstallGuideProps) {
  return (
    <ol
      className={`text-caption-1-medium text-gray-500 space-y-0.5 ${className ?? ''}`}
    >
      <li>1. 하단 공유 버튼(□↑) 탭</li>
      <li>2. &quot;홈 화면에 추가&quot; 선택</li>
      <li>3. 추가된 앱에서 알림 설정</li>
    </ol>
  );
}
