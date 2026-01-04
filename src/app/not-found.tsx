import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5">
      <h1 className="text-[64px] font-semibold leading-tight text-gray-950">404</h1>
      <p className="text-body-1-medium mt-2 text-gray-700">페이지를 찾을 수 없습니다</p>
      <Link
        href="/"
        className="text-body-2-medium mt-6 rounded-full bg-gray-900 px-6 py-3 text-white"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
