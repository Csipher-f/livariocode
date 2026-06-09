"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { markAllNotificationsRead } from "@/features/notifications/actions/mark-notifications-read";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Notification } from "@/features/notifications/actions/get-notifications";

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "just now";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
}

function getInquiryHref(activeRole: string, inquiryId: string): string {
  if (activeRole === "landlord") {
    return `/dashboard/landlord/inquiries/${inquiryId}`;
  }
  return `/dashboard/tenant/inquiries/${inquiryId}`;
}

export function NotificationBell({
  initialUnreadCount,
  initialNotifications,
  activeRole,
}: {
  userId?: string;
  initialUnreadCount: number;
  initialNotifications: Notification[];
  activeRole: string;
}) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const handleMarkAllRead = useCallback(async () => {
    const result = await markAllNotificationsRead();

    if (result.success) {
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-md text-[#8C7B6B] transition hover:bg-[#F5EFE8] hover:text-[#1C1612]"
          type="button"
        >
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#E8623A] text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="border-b border-[#E8DDD4] px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1C1612]">Notifications</h3>
            {unreadCount > 0 ? (
              <button
                className="text-xs text-[#E8623A] hover:text-[#C44D28]"
                onClick={handleMarkAllRead}
                type="button"
              >
                Mark all read
              </button>
            ) : null}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#8C7B6B]">
              No notifications yet
            </p>
          ) : (
            <div>
              {notifications.map((notification) => {
                const href =
                  notification.resource_type === "inquiry" && notification.resource_id
                    ? getInquiryHref(activeRole, notification.resource_id)
                    : "#";

                return (
                  <Link
                    className={`block border-l-2 px-4 py-3 transition hover:bg-[#FDE8DF]/30 ${
                      notification.is_read
                        ? "border-transparent bg-transparent"
                        : "border-[#E8623A] bg-[#FDE8DF]/50"
                    }`}
                    href={href}
                    key={notification.id}
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-sm font-medium text-[#1C1612]">
                      {notification.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#8C7B6B]">
                      {notification.body}
                    </p>
                    <p className="mt-1 text-xs text-[#8C7B6B]">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
