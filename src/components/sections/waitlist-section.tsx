import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getWaitlistCount } from "@/features/waitlist/actions/get-waitlist-count";

export async function WaitlistSection() {
  const count = await getWaitlistCount();

  return (
    <section className="bg-[#1C1612] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[#FDFAF7] sm:text-4xl font-serif">
          Be the first to know when Livario launches
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#FDFAF7]/70 sm:text-base">
          Join{" "}
          <span className="font-semibold text-[#FDFAF7]">
            {count.total.toLocaleString()}
          </span>{" "}
          others already on the waitlist — tenants and landlords welcome.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="outline">
            <Link href="/waitlist#tenant">
              Join as Tenant
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/waitlist#landlord">
              List Your Property
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
