import { LoadingState } from "@/components/ui/loading-state";

export default function AdminUserProfileLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <LoadingState
        description="Loading user profile."
        title="Loading profile"
      />
    </main>
  );
}
