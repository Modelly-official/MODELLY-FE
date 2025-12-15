import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
  <div className="relative bg-white font-sans">
      {/* Modelly 로고 */}
      <div className="mt-[164px] mx-auto mb-0 w-[212px] h-[58px]">
        <Image
          src="/images/modelly.svg"
          alt="Modelly Logo"
          width={212}
          height={58}
          className="w-full h-full"
          priority
        />
      </div>

      {/* 입력 폼 */}
      <div className="mt-6 mx-4 w-[343px]">
        <div className="mb-4">
          <label className="block text-black text-body-1-medium mb-2 tracking-tight">
            아이디
          </label>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            className="w-full border border-gray-400 rounded-xl p-4 text-black placeholder:text-gray-600 text-body-2-medium tracking-tight bg-white outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-black text-body-1-medium mb-2 tracking-tight">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full border border-gray-400 rounded-xl p-4 text-black placeholder:text-gray-600 text-body-2-medium tracking-tight bg-white outline-none"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          className="w-full bg-gray-900 text-blue-100 rounded-full py-4 px-2 text-body-1-semibold tracking-tight mb-6"
        >
          로그인
        </button>

        {/* 하단 링크 */}
        <div className="flex gap-4 text-gray-800 text-body-2-medium tracking-tight justify-center mb-20">
          <span>아이디 찾기</span>
          <span>|</span>
          <span>비밀번호 찾기</span>
          <span>|</span>
          <Link href="/signup" className="cursor-pointer hover:underline">회원가입</Link>
        </div>

        {/* SNS 로그인 안내 */}
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="w-[98px] h-px bg-gray-500" />
          <span className="text-gray-700 text-body-2-regular">SNS 계정으로 로그인</span>
          <div className="w-[98px] h-px bg-gray-500" />
        </div>

        {/* SNS 아이콘 */}
        <div className="flex gap-6 justify-center">
          {/* 카카오 로그인 */}
          <Link href="/signup?social=true">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200 cursor-pointer" />
          </Link>
          {/* 네이버 로그인 */}
          <Link href="/signup?social=true">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200 cursor-pointer" />
          </Link>
          {/* 구글 로그인 */}
          <Link href="/signup?social=true">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200 cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;