import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";
import { redirectIfAuthenticated } from "@/supabase/auth";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string | string[];
  }>;
};

function getLoginNotice(message?: string | string[]) {
  const value = Array.isArray(message) ? message[0] : message;

  if (value === "password-updated") {
    return "Your password has been updated. You can log in now.";
  }

  return undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated();

  const params = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to continue with Livario."
    >
      <LoginForm notice={getLoginNotice(params.message)} />
    </AuthCard>
  );
}
