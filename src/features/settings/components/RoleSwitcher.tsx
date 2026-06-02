"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeftRight, ShieldAlert, Award } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { switchRole } from "@/actions/profile";
import { toast } from "@/hooks/use-toast";
import type { Profile } from "@/types/database";

type RoleSwitcherProps = {
  profile: Profile;
};

export function RoleSwitcher({ profile }: RoleSwitcherProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const activeRole = profile.active_role;
  const isLandlord = profile.is_landlord;

  const handleRoleSwitch = async (newRole: "tenant" | "landlord") => {
    setIsPending(true);
    setDialogOpen(false);

    try {
      const result = await switchRole({ activeRole: newRole });

      if (!result.success) {
        toast({
          title: "Role Switch Failed",
          description: result.message,
          intent: "destructive",
        });
      } else {
        toast({
          title: `Role Switched`,
          description: result.message,
          intent: "success",
        });
        
        if (result.redirectTo) {
          router.push(result.redirectTo);
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Error switching role:", err);
      toast({
        title: "An error occurred",
        description: "Could not switch roles. Please try again.",
        intent: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10 overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-foreground flex items-center gap-2">
              <ShieldAlert className="size-5 text-muted-foreground shrink-0" />
              Role Mode & Capability
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Switch roles or activate new capabilities on your profile.
            </CardDescription>
          </div>
          <div>
            <Badge
              variant="outline"
              className={
                activeRole === "landlord"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 capitalize font-semibold py-1 px-3"
                  : "bg-blue-500/10 text-blue-500 border-blue-500/20 capitalize font-semibold py-1 px-3"
              }
            >
              {activeRole} mode active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Livario features a dual-role architecture. You can switch between Tenant
          and Landlord modes instantly if you have activated both. Your settings, favorites,
          and inquiries will always remain safe.
        </p>

        {isLandlord ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-background border border-border p-4 rounded-md justify-between">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-semibold text-foreground">
                You have active Tenant and Landlord roles.
              </p>
              <p className="text-xs">
                Switching modes changes your sidebar menus and dashboard display.
              </p>
            </div>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() =>
                handleRoleSwitch(activeRole === "landlord" ? "tenant" : "landlord")
              }
              className="gap-2 shrink-0 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowLeftRight className="size-4" />
              )}
              Switch to {activeRole === "landlord" ? "Tenant Mode" : "Landlord Mode"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-background border border-border p-4 rounded-md justify-between">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-semibold text-foreground">
                Become a Landlord on Livario
              </p>
              <p className="text-xs">
                List houses, manage rentals, and communicate directly with renters.
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={isPending} className="gap-2 shrink-0 cursor-pointer">
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Award className="size-4" />
                  )}
                  Become a Landlord
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Become a Landlord</DialogTitle>
                  <DialogDescription>
                    You are activating Landlord Mode on your profile. This allows
                    you to create property listings, manage tenant inquiries, and utilize
                    the landlord management tools.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-1 space-y-3 text-sm text-muted-foreground">
                  <p>
                    By proceeding:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your account capability will expand to support Landlord listings.</li>
                    <li>You will be redirected to the Landlord dashboard.</li>
                    <li>You can switch back to Tenant Mode anytime via Settings.</li>
                  </ul>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={isPending}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRoleSwitch("landlord")}
                    disabled={isPending}
                    className="cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    Confirm & Switch
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/40 text-muted-foreground text-xs py-3 px-6 border-t border-border">
        <span>You can switch roles anytime from Settings or the dashboard navigation.</span>
      </CardFooter>
    </Card>
  );
}
