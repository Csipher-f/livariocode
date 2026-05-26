export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Livario
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Modern housing discovery is taking shape.
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Phase 0 is setting the foundation for a premium, mobile-first housing
          platform built with clean architecture and production-ready standards.
        </p>
      </section>
    </main>
  );
}
