"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/actions/profile";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/supabase/browser-client";
import type { Profile } from "@/types/database";
import { AvatarUpload } from "./AvatarUpload";

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = React.useState(profile.full_name ?? "");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const isChanged =
    fullName.trim() !== (profile.full_name ?? "") || selectedFile !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fullName.trim().length < 2) {
      toast({
        title: "Validation Error",
        description: "Name must be at least 2 characters.",
        intent: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      let finalAvatarUrl: string | null | undefined = undefined;

      // Handle avatar upload if a new file was chosen
      if (selectedFile) {
        const supabase = createClient();
        const path = `${profile.id}/avatar.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, selectedFile, {
            contentType: selectedFile.type,
            upsert: true,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          toast({
            title: "Avatar Upload Failed",
            description: "Failed to upload your avatar photo. Please try again.",
            intent: "destructive",
          });
          setIsSaving(false);
          return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        // Force browser update via cache-buster
        finalAvatarUrl = `${data.publicUrl}?t=${Date.now()}`;
      }

      // Call Server Action
      const result = await updateProfile({
        fullName: fullName.trim(),
        avatarUrl: finalAvatarUrl,
      });

      if (!result.success) {
        toast({
          title: "Update Failed",
          description: result.message,
          intent: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved.",
          intent: "success",
        });
        setSelectedFile(null); // Clear selected file once saved
        router.refresh();
      }
    } catch (err) {
      console.error("Error saving profile settings:", err);
      toast({
        title: "An error occurred",
        description: "An unexpected error occurred. Please try again.",
        intent: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Update your public representation on Livario.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-0">
          <AvatarUpload
            currentAvatarUrl={profile.avatar_url}
            fullName={profile.full_name}
            onFileSelect={setSelectedFile}
            isUploading={isSaving}
          />

          <Separator />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email ?? ""}
                disabled
                className="bg-muted text-muted-foreground select-all"
              />
              <p className="text-[10px] text-muted-foreground">
                Email address cannot be changed. Contact support if required.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSaving}
                required
                minLength={2}
                maxLength={80}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 px-0 border-t border-border pt-4">
          <Button
            type="submit"
            disabled={!isChanged || isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving Changes
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
