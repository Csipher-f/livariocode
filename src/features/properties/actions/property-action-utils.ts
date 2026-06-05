import "server-only";

import { z } from "zod";

import { PROPERTY_TYPES } from "@/features/properties/types";
import { getCurrentProfile, getCurrentUser } from "@/supabase/auth";
import { createClient } from "@/supabase/server-client";
import type { Database, PropertyStatus } from "@/types/database";

export const propertyStatusSchema = z.enum(["draft", "published"]);

export const propertyFormSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(2500).optional(),
  propertyType: z.enum(PROPERTY_TYPES),
  price: z.coerce.number().min(1),
  rentPeriod: z.enum(["monthly", "six_months", "yearly"]),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  address: z.string().trim().max(180).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  status: propertyStatusSchema,
  primaryImageKey: z.string().trim().optional(),
  removedImageIds: z.array(z.string().uuid()).default([]),
});

export type PropertyActionResult =
  | {
      success: true;
      message: string;
      propertyId: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string>;
    };

export type ParsedPropertyForm = z.infer<typeof propertyFormSchema>;

export type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

const imageMaxSize = 5 * 1024 * 1024;
const maxImages = 10;

export async function requireActiveLandlord() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  if (!user || !profile) {
    return {
      error: "Please log in to manage listings.",
      user: null,
    };
  }

  if (!profile.is_landlord || profile.active_role !== "landlord") {
    return {
      error: "Switch to landlord mode before managing listings.",
      user: null,
    };
  }

  return {
    error: null,
    user,
  };
}

export function parsePropertyFormData(formData: FormData) {
  const removedImageIds = formData
    .getAll("removedImageIds")
    .filter((value): value is string => typeof value === "string");

  return propertyFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    propertyType: formData.get("propertyType"),
    price: formData.get("price"),
    rentPeriod: formData.get("rentPeriod") || "yearly",
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    address: formData.get("address") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    status: formData.get("status"),
    primaryImageKey: formData.get("primaryImageKey") || undefined,
    removedImageIds,
  });
}

export function getImageFiles(formData: FormData) {
  return formData.getAll("images").filter((value): value is File => {
    return value instanceof File && value.size > 0;
  });
}

export function validateImages(files: File[], existingImageCount = 0) {
  if (files.length + existingImageCount > maxImages) {
    return "Listings can have up to 10 images.";
  }

  const invalidFile = files.find((file) => !file.type.startsWith("image/"));

  if (invalidFile) {
    return "Only image files can be uploaded.";
  }

  const oversizedFile = files.find((file) => file.size > imageMaxSize);

  if (oversizedFile) {
    return "Each image must be 5MB or smaller.";
  }

  return null;
}

function getFieldErrors(error: z.ZodError<ParsedPropertyForm>) {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const key = issue.path[0];

    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  });

  return fieldErrors;
}

export function validationErrorResult(
  error: z.ZodError<ParsedPropertyForm>
): PropertyActionResult {
  return {
    success: false,
    message: "Please check the highlighted fields.",
    fieldErrors: getFieldErrors(error),
  };
}

function sanitizeFileName(fileName: string) {
  const cleanedName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return cleanedName || "property-image";
}

export async function uploadPropertyImages({
  files,
  primaryImageKey,
  propertyId,
  supabase,
}: {
  files: File[];
  primaryImageKey?: string;
  propertyId: string;
  supabase: ServerSupabaseClient;
}) {
  const imageRows: Database["public"]["Tables"]["property_images"]["Insert"][] =
    [];

  for (const [index, file] of files.entries()) {
    const path = `properties/${propertyId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        error: "One of the images could not be uploaded.",
        imageRows,
      };
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(path);

    imageRows.push({
      property_id: propertyId,
      image_url: data.publicUrl,
      storage_path: path,
      is_primary: primaryImageKey
        ? primaryImageKey === `new:${index}`
        : index === 0,
      display_order: index,
    });
  }

  return {
    error: null,
    imageRows,
  };
}

export function toDatabaseStatus(
  status: "draft" | "published"
): PropertyStatus {
  return status;
}
