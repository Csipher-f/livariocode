"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/actions/profile";
import { toast } from "@/hooks/use-toast";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleFormReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validations
    const fieldErrors: Record<string, string> = {};

    if (!currentPassword) {
      fieldErrors.currentPassword = "Current password is required.";
    }

    if (newPassword.length < 8) {
      fieldErrors.newPassword = "Password must be at least 8 characters.";
    }

    if (newPassword !== confirmPassword) {
      fieldErrors.confirmPassword = "The passwords do not match yet.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        toast({
          title: "Password Change Failed",
          description: result.message,
          intent: "destructive",
        });

        if (result.errors) {
          const flatErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, val]) => {
            flatErrors[key] = val[0] || "Invalid field value";
          });
          setErrors(flatErrors);
        }
      } else {
        toast({
          title: "Password Changed",
          description: "Your account password has been updated.",
          intent: "success",
        });
        handleFormReset();
      }
    } catch (err) {
      console.error("Error updating account password:", err);
      toast({
        title: "An error occurred",
        description: "An unexpected error occurred. Please try again.",
        intent: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update the password credentials used for logging into your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {errors.currentPassword ? (
              <p className="text-xs font-medium text-destructive">
                {errors.currentPassword}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password (min. 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                required
                minLength={8}
              />
              {errors.newPassword ? (
                <p className="text-xs font-medium text-destructive">
                  {errors.newPassword}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.confirmPassword ? (
                <p className="text-xs font-medium text-destructive">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 px-0 border-t border-border pt-4 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Changing Password
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
