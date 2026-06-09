import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, Home, Search, Shield, UserCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LivarioLogo } from "@/components/livario-logo";
import { getWaitlistCount } from "@/features/waitlist/actions/get-waitlist-count";
import { createPageMetadata } from "@/lib/metadata";
import { WaitlistForm } from "@/app/waitlist/components/waitlist-form";

export const metadata: Metadata = createPageMetadata({
  title: "Join the Waitlist",
  description:
    "Get early access to Livario — Nigeria's premium housing discovery platform. No agent fees. Verified landlords.",
  canonical: "/waitlist",
});

export default async function WaitlistPage() {
  const count = await getWaitlistCount();

  return (
    <main className="min-h-screen bg-[#FDFAF7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Livario home">
          <LivarioLogo />
        </Link>
      </div>

      <section className="mx-auto max-w-4xl px-4 pb-6 text-center sm:px-6">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl font-serif">
          Find your perfect home. No agents. No stress.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#8C7B6B] sm:text-lg">
          Join{" "}
          <span className="font-semibold text-[#1C1612]">
            {count.total.toLocaleString()}
          </span>{" "}
          others getting early access
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-12 sm:px-6 md:grid-cols-2">
        <Card className="scroll-fade" id="tenant">
          <CardContent className="p-6 sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FDE8DF]">
              <Home className="size-6 text-[#E8623A]" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">
              I&apos;m looking for a home
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#8C7B6B]">
              Get early access to verified listings directly from landlords. No
              agent fees, ever.
            </p>
            <WaitlistForm buttonLabel="Join as Tenant" role="tenant" />
          </CardContent>
        </Card>

        <Card className="scroll-fade" id="landlord">
          <CardContent className="p-6 sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FDE8DF]">
              <Building2 className="size-6 text-[#E8623A]" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">
              I want to list my property
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#8C7B6B]">
              List your property for free at launch and connect directly with
              quality tenants.
            </p>
            <WaitlistForm buttonLabel="List for Free" role="landlord" />
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#E8DDD4] bg-[#FFF8F2] p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FDE8DF]">
              <Search className="size-4 text-[#E8623A]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Zero agency fees</p>
              <p className="text-xs text-[#8C7B6B]">
                Direct from landlord to tenant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#E8DDD4] bg-[#FFF8F2] p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FDE8DF]">
              <Shield className="size-4 text-[#E8623A]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Verified landlords</p>
              <p className="text-xs text-[#8C7B6B]">
                Trustworthy property owners
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#E8DDD4] bg-[#FFF8F2] p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FDE8DF]">
              <UserCheck className="size-4 text-[#E8623A]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Nigeria-focused</p>
              <p className="text-xs text-[#8C7B6B]">
                Built for the Nigerian market
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 text-center">
        <Link
          className="inline-flex items-center gap-1 text-sm font-medium text-[#8C7B6B] transition-colors hover:text-[#1C1612]"
          href="/"
        >
          <ArrowLeft className="size-4" />
          Back to Livario
        </Link>
      </section>
    </main>
  );
}
