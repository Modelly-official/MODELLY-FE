import SignupFunnel from "./_funnel/SignupFunnel";

interface SignupPageProps {
  searchParams: Promise<{ social?: string }>;
}

const SignupPage = async ({ searchParams }: SignupPageProps) => {
  const params = await searchParams;
  const isSocial = params.social === "true";
  return <SignupFunnel isSocial={isSocial} />;
};

export default SignupPage;