import { Building2, KeyRound } from "lucide-react";

import { chooseOnboardingRole } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { requireUser } from "@/supabase/auth";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            How would you like to use Livario?
          </h1>
        </CardHeader>
        <CardContent className="grid gap-3">
          <form action={chooseOnboardingRole}>
            <input type="hidden" name="activeRole" value="tenant" />
            <Button type="submit" size="lg" className="w-full">
              <KeyRound className="size-4" />
              Continue as Tenant
            </Button>
          </form>
          <form action={chooseOnboardingRole}>
            <input type="hidden" name="activeRole" value="landlord" />
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Building2 className="size-4" />
              Continue as Landlord
            </Button>
          </form>
          <p className="pt-2 text-center text-sm text-muted-foreground">
            You can switch this later in Settings
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
