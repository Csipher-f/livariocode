"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Building2, Lock, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { sendReply } from "@/features/inquiries/actions/send-reply";
import { closeInquiry } from "@/features/inquiries/actions/close-inquiry";
import { ReplyForm } from "./reply-form";
import type { InquiryThread, ReplyWithProfile } from "../actions/get-inquiry-thread";

interface InquiryThreadComponentProps {
  initialThread: InquiryThread;
  currentUserId: string;
  currentUserRole: "tenant" | "landlord";
}

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  hour: "2-digit",
  minute: "2-digit",
  day: "numeric",
  month: "short",
});

const fallbackImage = "/images/listings/listing-1.svg";

export function InquiryThreadComponent({
  initialThread,
  currentUserId,
  currentUserRole,
}: InquiryThreadComponentProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [status, setStatus] = React.useState(initialThread.status);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Group all messages (original message + replies)
  const originalMessageAsReply: ReplyWithProfile = {
    id: "original",
    inquiryId: initialThread.id,
    senderId: initialThread.tenantId,
    message: initialThread.originalMessage,
    createdAt: initialThread.createdAt,
    senderName: initialThread.tenantName,
    senderAvatarUrl: initialThread.tenantAvatarUrl,
  };

  const [optimisticReplies, addOptimisticReply] = React.useOptimistic<
    ReplyWithProfile[],
    ReplyWithProfile
  >(initialThread.replies, (state, newReply) => [...state, newReply]);

  const allMessages = [originalMessageAsReply, ...optimisticReplies];

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  React.useEffect(() => {
    scrollToBottom("instant");
  }, []);

  React.useEffect(() => {
    scrollToBottom("smooth");
  }, [optimisticReplies.length]);

  const handleSend = async (messageText: string) => {
    const isTenant = currentUserRole === "tenant";
    const senderName = isTenant ? initialThread.tenantName : initialThread.landlordName;
    const senderAvatarUrl = isTenant
      ? initialThread.tenantAvatarUrl
      : initialThread.landlordAvatarUrl;

    const tempReply: ReplyWithProfile = {
      id: `temp-${Date.now()}`,
      inquiryId: initialThread.id,
      senderId: currentUserId,
      message: messageText,
      createdAt: new Date().toISOString(),
      senderName,
      senderAvatarUrl,
    };

    startTransition(async () => {
      addOptimisticReply(tempReply);
      const result = await sendReply({
        inquiryId: initialThread.id,
        message: messageText,
      });

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          intent: "destructive",
        });
      } else {
        router.refresh();
      }
    });
  };

  const handleCloseThread = async () => {
    if (!confirm("Are you sure you want to close this inquiry thread? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const result = await closeInquiry(initialThread.id);
      if (result.success) {
        setStatus("closed");
        toast({
          title: "Inquiry Closed",
          description: result.message,
          intent: "success",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.message,
          intent: "destructive",
        });
      }
    });
  };

  const isClosed = status === "closed";
  const backUrl =
    currentUserRole === "landlord"
      ? "/dashboard/landlord/inquiries"
      : "/dashboard/tenant/inquiries";

  const otherPartyName =
    currentUserRole === "tenant" ? initialThread.landlordName : initialThread.tenantName;
  const otherPartyAvatar =
    currentUserRole === "tenant"
      ? initialThread.landlordAvatarUrl
      : initialThread.tenantAvatarUrl;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-screen bg-background border rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button asChild size="icon" variant="ghost" className="size-8">
            <Link href={backUrl}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Avatar className="size-9 border">
            {otherPartyAvatar ? (
              <AvatarImage src={otherPartyAvatar} alt={otherPartyName} />
            ) : null}
            <AvatarFallback>{otherPartyName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              {otherPartyName}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2 className="size-3" />
              <Link
                href={`/listings/${initialThread.propertyId}`}
                className="hover:underline line-clamp-1"
              >
                {initialThread.propertyTitle}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isClosed ? (
            <Badge variant="secondary" className="gap-1">
              <Lock className="size-3" />
              Closed
            </Badge>
          ) : (
            <>
              {currentUserRole === "landlord" && (
                <Button
                  onClick={handleCloseThread}
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  className="text-xs h-8 border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  Close Inquiry
                </Button>
              )}
              <Badge variant="warning" className="capitalize text-xs">
                {status}
              </Badge>
            </>
          )}
        </div>
      </header>

      {/* Property Bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 border-b border-border shrink-0 text-xs">
        <div className="relative size-10 rounded overflow-hidden border bg-background shrink-0">
          <Image
            src={initialThread.propertyThumbnailUrl || fallbackImage}
            alt={initialThread.propertyTitle}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">{initialThread.propertyTitle}</p>
          <p className="text-muted-foreground truncate mt-0.5">
            Related inquiry. Keep replies professional and respectful.
          </p>
        </div>
        <Button asChild size="sm" variant="ghost" className="text-xs h-7 shrink-0">
          <Link href={`/listings/${initialThread.propertyId}`}>View Listing</Link>
        </Button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-muted/5">
        {allMessages.map((msg, idx) => {
          const isSelf = msg.senderId === currentUserId;
          const showAvatar = idx === 0 || allMessages[idx - 1].senderId !== msg.senderId;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${
                isSelf ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar placeholder to align messages */}
              {!isSelf && showAvatar ? (
                <Avatar className="size-7 shrink-0 border">
                  {msg.senderAvatarUrl ? (
                    <AvatarImage src={msg.senderAvatarUrl} alt={msg.senderName} />
                  ) : null}
                  <AvatarFallback>{msg.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : !isSelf ? (
                <div className="size-7 shrink-0" />
              ) : null}

              <div className="flex flex-col">
                {showAvatar && !isSelf && (
                  <span className="text-[10px] text-muted-foreground ml-1 mb-0.5">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                    isSelf
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-none"
                      : "bg-card text-foreground border rounded-2xl rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
                <span
                  className={`text-[9px] text-muted-foreground mt-0.5 ${
                    isSelf ? "text-right mr-1" : "ml-1"
                  }`}
                >
                  {dateFormatter.format(new Date(msg.createdAt))}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer (Reply Form or Closed Banner) */}
      <div className="shrink-0 border-t border-border">
        {isClosed ? (
          <div className="flex items-center justify-center gap-2 p-4 bg-muted/40 text-sm text-muted-foreground">
            <ShieldAlert className="size-4 text-muted-foreground" />
            <span>This inquiry has been closed by the landlord.</span>
          </div>
        ) : (
          <ReplyForm onSend={handleSend} disabled={isPending} />
        )}
      </div>
    </div>
  );
}
