"use client";

import * as React from "react";
import { Camera, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

type AvatarUploadProps = {
  currentAvatarUrl: string | null;
  fullName: string | null;
  onFileSelect: (file: File | null) => void;
  isUploading?: boolean;
};

function getInitials(name?: string | null) {
  const value = name ?? "Livario User";
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "L";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AvatarUpload({
  currentAvatarUrl,
  fullName,
  onFileSelect,
  isUploading = false,
}: AvatarUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const initials = React.useMemo(() => getInitials(fullName), [fullName]);

  const handleContainerClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: image files only
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WebP).",
        intent: "destructive",
      });
      return;
    }

    // Validate size: max 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be 2MB or smaller.",
        intent: "destructive",
      });
      return;
    }

    onFileSelect(file);

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Cleanup object URL on unmount to avoid leaks
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const activeSrc = previewUrl ?? currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div
        className="group relative cursor-pointer overflow-hidden rounded-full focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        onClick={handleContainerClick}
      >
        <Avatar className="size-24 border-2 border-border transition-all group-hover:opacity-85 sm:size-28">
          {activeSrc ? (
            <AvatarImage alt="Avatar preview" src={activeSrc} />
          ) : null}
          <AvatarFallback className="text-xl font-semibold bg-secondary/80 text-secondary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100 rounded-full">
            <Camera className="size-5 mb-0.5" />
            <span className="text-[10px] font-medium px-1">Change</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-1.5">
        <h3 className="text-sm font-medium">Your Profile Photo</h3>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Upload a clear profile photo. Only image files under 2MB are supported.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          aria-label="Upload profile photo"
        />
      </div>
    </div>
  );
}
