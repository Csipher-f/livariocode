import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { createPageMetadata } from "@/lib/metadata";
import { createClient } from "@/supabase/server-client";

export const metadata = createPageMetadata({
  title: "Reset Password",
  description: "Choose a new Livario password.",
  noIndex: true,
});

type ResetPasswordPageProps = {
  searchParams: Promise<{
    code?: string | string[];
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const code = Array.isArray(params.code) ? params.code[0] : params.code;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return (
    <AuthCard
      title="Choose a new password"
      description="Use a password that is private and hard to guess."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
