import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Livario
        </Link>
        {children}
      </div>
    </main>
  );
}
