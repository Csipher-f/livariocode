import Link from "next/link";
import { LivarioLogo } from "@/components/livario-logo";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFAF7] px-4 py-8 text-foreground sm:px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/">
          <LivarioLogo />
        </Link>
        {children}
      </div>
    </main>
  );
}
