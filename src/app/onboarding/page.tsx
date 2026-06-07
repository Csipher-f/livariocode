import { Building2, KeyRound } from "lucide-react";

import { chooseOnboardingRole } from "@/actions/onboarding";
import { LivarioLogo } from "@/components/livario-logo";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/supabase/auth";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FDFAF7] px-4 py-10">
      <Card className="w-full max-w-md border border-[#E8DDD4] bg-[#FFF8F2] shadow-sm">
        <CardContent className="p-8">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <LivarioLogo />
            <div>
              <h1 className="font-serif text-3xl font-semibold text-[#1C1612]">
                Welcome to Livario
              </h1>
              <p className="mt-2 text-sm text-[#8C7B6B]">
                Tell us how you plan to use the platform so we can set up your
                experience.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <form action={chooseOnboardingRole}>
              <input type="hidden" name="activeRole" value="tenant" />
              <button
                type="submit"
                className="w-full rounded-xl border-2 border-[#E8623A] bg-white p-5 text-left transition hover:bg-[#FDE8DF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8623A]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E8623A] text-white">
                    <KeyRound className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1612]">
                      Continue as Tenant
                    </p>
                    <p className="mt-1 text-sm text-[#8C7B6B]">
                      Browse listings, save favourites, and contact landlords.
                    </p>
                  </div>
                </div>
              </button>
            </form>

            <form action={chooseOnboardingRole}>
              <input type="hidden" name="activeRole" value="landlord" />
              <button
                type="submit"
                className="w-full rounded-xl border-2 border-[#E8DDD4] bg-white p-5 text-left transition hover:border-[#E8623A] hover:bg-[#FDE8DF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8623A]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F5EFE8] text-[#E8623A]">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1612]">
                      Continue as Landlord
                    </p>
                    <p className="mt-1 text-sm text-[#8C7B6B]">
                      List your properties and manage tenant inquiries.
                    </p>
                  </div>
                </div>
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-[#8C7B6B]">
            You can switch this later in Settings
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
