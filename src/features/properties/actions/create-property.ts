"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/supabase/server-client";
import {
  getImageFiles,
  parsePropertyFormData,
  requireActiveLandlord,
  toDatabaseStatus,
  uploadPropertyImages,
  validateImages,
  validationErrorResult,
  type PropertyActionResult,
} from "@/features/properties/actions/property-action-utils";

export async function createProperty(
  formData: FormData
): Promise<PropertyActionResult> {
  const landlord = await requireActiveLandlord();

  if (landlord.error || !landlord.user) {
    return {
      success: false,
      message: landlord.error ?? "You are not allowed to create listings.",
    };
  }

  const parsedForm = parsePropertyFormData(formData);

  if (!parsedForm.success) {
    return validationErrorResult(parsedForm.error);
  }

  const files = getImageFiles(formData);
  const imageValidationError = validateImages(files);

  if (imageValidationError) {
    return {
      success: false,
      message: imageValidationError,
    };
  }

  const supabase = await createClient();
  const values = parsedForm.data;
  const { data: location, error: locationError } = await supabase
    .from("property_locations")
    .insert({
      created_by: landlord.user.id,
      address: values.address || null,
      city: values.city,
      state: values.state,
      country: "Nigeria",
    })
    .select("id")
    .single();

  if (locationError || !location) {
    console.error("Location insert error:", locationError);
    return {
      success: false,
      message: "We could not save the property location.",
    };
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .insert({
      owner_id: landlord.user.id,
      location_id: location.id,
      title: values.title,
      description: values.description || null,
      price: values.price,
      property_type: values.propertyType,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      status: toDatabaseStatus(values.status),
    })
    .select("id")
    .single();

  if (propertyError || !property) {
    return {
      success: false,
      message: "We could not create this listing.",
    };
  }

  if (files.length > 0) {
    const uploadResult = await uploadPropertyImages({
      files,
      primaryImageKey: values.primaryImageKey,
      propertyId: property.id,
      supabase,
    });

    if (uploadResult.error) {
      console.error("Image upload error:", uploadResult.error);
      return {
        success: false,
        message: uploadResult.error,
      };
    }

    const { error: imageInsertError } = await supabase
      .from("property_images")
      .insert(uploadResult.imageRows);

    if (imageInsertError) {
      console.error("Image insert error:", imageInsertError);
      return {
        success: false,
        message: "The listing was created, but images could not be attached.",
      };
    }
  }

  revalidatePath("/dashboard/landlord");
  revalidatePath("/dashboard/landlord/properties");
  revalidatePath("/listings");

  return {
    success: true,
    message: "Listing created.",
    propertyId: property.id,
  };
}
