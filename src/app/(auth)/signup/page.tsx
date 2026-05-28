import { AuthCard } from "@/features/auth/components/auth-card";
import { SignupForm } from "@/features/auth/components/signup-form";
import { redirectIfAuthenticated } from "@/supabase/auth";

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <AuthCard
      title="Create your account"
      description="Start finding or listing homes with Livario."
    >
      <SignupForm />
    </AuthCard>
  );
}
