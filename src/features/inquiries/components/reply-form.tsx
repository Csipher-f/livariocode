"use client";

import * as React from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function ReplyForm({ onSend, disabled }: ReplyFormProps) {
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(message.trim());
      setMessage("");
    } catch (err) {
      console.error("Error sending message in form", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-border bg-background p-4 sticky bottom-0 z-10"
    >
      <div className="flex-1">
        <Textarea
          placeholder="Type your reply... (Press Enter to send)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[44px] max-h-[120px] resize-none py-2.5 px-4 text-sm"
          disabled={isSending || disabled}
          rows={1}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isSending || disabled}
        className="rounded-full size-11 shrink-0"
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
}
