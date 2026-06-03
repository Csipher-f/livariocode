import { LoadingState } from "@/components/ui/loading-state";

export default function AdminInquiriesLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <LoadingState
        description="Loading inquiry table."
        title="Loading inquiries"
      />
    </main>
  );
}
