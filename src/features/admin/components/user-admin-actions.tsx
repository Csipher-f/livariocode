"use client";

import Link from "next/link";
import { Eye, PauseCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function UserAdminActions({ userId }: { userId: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/users/${userId}`}>
          <Eye className="size-4" />
          View profile
        </Link>
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Coming Soon",
            description: "Account suspension will be added in a future phase.",
          })
        }
        size="sm"
        type="button"
        variant="outline"
      >
        <PauseCircle className="size-4" />
        Suspend
      </Button>
    </div>
  );
}
