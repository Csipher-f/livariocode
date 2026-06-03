"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Archive, Eye, Loader2, Trash2 } from "lucide-react";

import { adminArchiveProperty, adminDeleteProperty } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function PropertyAdminActions({
  propertyId,
  title,
}: {
  propertyId: string;
  title: string;
}) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function runArchive() {
    startTransition(async () => {
      const result = await adminArchiveProperty({ propertyId });

      toast({
        title: result.success ? "Listing archived" : "Listing not archived",
        description: result.message,
        intent: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setArchiveOpen(false);
      }
    });
  }

  function runDelete() {
    startTransition(async () => {
      const result = await adminDeleteProperty({ propertyId });

      toast({
        title: result.success ? "Listing deleted" : "Listing not deleted",
        description: result.message,
        intent: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setDeleteOpen(false);
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/listings/${propertyId}`}>
            <Eye className="size-4" />
            View
          </Link>
        </Button>
        <Button
          disabled={isPending}
          onClick={() => setArchiveOpen(true)}
          size="sm"
          type="button"
          variant="outline"
        >
          <Archive className="size-4" />
          Archive
        </Button>
        <Button
          disabled={isPending}
          onClick={() => setDeleteOpen(true)}
          size="sm"
          type="button"
          variant="destructive"
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>

      <Dialog onOpenChange={setArchiveOpen} open={archiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive this listing?</DialogTitle>
            <DialogDescription>
              {title} will be removed from public discovery and kept as an
              archived property record.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => setArchiveOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} onClick={runArchive} type="button">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Archive listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this listing?</DialogTitle>
            <DialogDescription>
              This permanently deletes {title}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => setDeleteOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={runDelete}
              type="button"
              variant="destructive"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
