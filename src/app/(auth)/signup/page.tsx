import SignupFunnel from "./funnel/SignupFunnel";

interface SignupPageProps {
  searchParams: Promise<{ social?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const isSocial = params.social === "true";
  
  return <SignupFunnel isSocial={isSocial} />;
}