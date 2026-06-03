import { LoadingState } from "@/components/ui/loading-state";

export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <LoadingState
        description="Loading platform stats."
        title="Loading admin overview"
      />
    </main>
  );
}
