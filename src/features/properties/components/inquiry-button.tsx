"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { sendInquiry } from "@/features/properties/actions/send-inquiry";

export function InquiryButton({
  isAuthenticated,
  propertyId,
  propertyTitle,
}: {
  isAuthenticated: boolean;
  propertyId: string;
  propertyTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleContactClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setOpen(true);
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await sendInquiry({
        propertyId,
        message,
      });

      if (result.success) {
        setMessage("");
        setOpen(false);
        toast({
          title: "Inquiry sent",
          description: result.message,
          intent: "success",
        });
        return;
      }

      toast({
        title: "Could not send inquiry",
        description: result.message,
        intent: "destructive",
      });
    });
  }

  return (
    <>
      <Button className="w-full" onClick={handleContactClick} size="lg">
        Contact Landlord
      </Button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact landlord</DialogTitle>
            <DialogDescription>
              Send a short message about {propertyTitle}. Your inquiry will be
              shared with the landlord.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="inquiry-message">Message</Label>
            <Textarea
              disabled={isPending}
              id="inquiry-message"
              maxLength={1000}
              minLength={10}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Hi, I would like to know if this home is still available."
              value={message}
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/1000 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || message.trim().length < 10}
              onClick={handleSubmit}
              type="button"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
