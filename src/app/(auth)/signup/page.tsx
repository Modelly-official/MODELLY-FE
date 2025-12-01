import { redirect } from "next/navigation";

// signup 경로로 접속 시, 약관 동의 페이지(signup/terms)로 리다이렉트
const SignupRedirect = () => {
  redirect("/signup/terms");
  return null;
}

export default SignupRedirect;