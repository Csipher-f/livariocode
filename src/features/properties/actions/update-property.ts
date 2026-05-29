"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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

const propertyIdSchema = z.string().uuid();

type ExistingImageRow = {
  id: string;
};

export async function updateProperty(
  propertyId: string,
  formData: FormData
): Promise<PropertyActionResult> {
  const parsedPropertyId = propertyIdSchema.safeParse(propertyId);

  if (!parsedPropertyId.success) {
    return {
      success: false,
      message: "This listing could not be found.",
    };
  }

  const landlord = await requireActiveLandlord();

  if (landlord.error || !landlord.user) {
    return {
      success: false,
      message: landlord.error ?? "You are not allowed to update listings.",
    };
  }

  const parsedForm = parsePropertyFormData(formData);

  if (!parsedForm.success) {
    return validationErrorResult(parsedForm.error);
  }

  const supabase = await createClient();
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id,location_id,owner_id")
    .eq("id", parsedPropertyId.data)
    .eq("owner_id", landlord.user.id)
    .maybeSingle();

  if (propertyError || !property) {
    return {
      success: false,
      message: "This listing could not be found.",
    };
  }

  const values = parsedForm.data;
  const { data: existingImages } = await supabase
    .from("property_images")
    .select("id")
    .eq("property_id", property.id);
  const keptExistingImageCount = (
    (existingImages ?? []) as ExistingImageRow[]
  ).filter((image) => !values.removedImageIds.includes(image.id)).length;
  const files = getImageFiles(formData);
  const imageValidationError = validateImages(files, keptExistingImageCount);

  if (imageValidationError) {
    return {
      success: false,
      message: imageValidationError,
    };
  }

  if (property.location_id) {
    const { error: locationError } = await supabase
      .from("property_locations")
      .update({
        address: values.address || null,
        city: values.city,
        state: values.state,
      })
      .eq("id", property.location_id)
      .eq("created_by", landlord.user.id);

    if (locationError) {
      return {
        success: false,
        message: "We could not update the property location.",
      };
    }
  }

  const { error: updateError } = await supabase
    .from("properties")
    .update({
      title: values.title,
      description: values.description || null,
      price: values.price,
      property_type: values.propertyType,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      status: toDatabaseStatus(values.status),
    })
    .eq("id", property.id)
    .eq("owner_id", landlord.user.id);

  if (updateError) {
    return {
      success: false,
      message: "We could not update this listing.",
    };
  }

  if (values.removedImageIds.length > 0) {
    await supabase
      .from("property_images")
      .delete()
      .eq("property_id", property.id)
      .in("id", values.removedImageIds);
  }

  if (files.length > 0) {
    const uploadResult = await uploadPropertyImages({
      files,
      primaryImageKey: values.primaryImageKey,
      propertyId: property.id,
      supabase,
    });

    if (uploadResult.error) {
      return {
        success: false,
        message: uploadResult.error,
      };
    }

    const { error: imageInsertError } = await supabase
      .from("property_images")
      .insert(uploadResult.imageRows);

    if (imageInsertError) {
      return {
        success: false,
        message:
          "The listing was updated, but new images could not be attached.",
      };
    }
  }

  if (values.primaryImageKey?.startsWith("existing:")) {
    const primaryImageId = values.primaryImageKey.replace("existing:", "");

    await supabase
      .from("property_images")
      .update({ is_primary: false })
      .eq("property_id", property.id);
    await supabase
      .from("property_images")
      .update({ is_primary: true })
      .eq("property_id", property.id)
      .eq("id", primaryImageId);
  }

  revalidatePath("/dashboard/landlord");
  revalidatePath("/dashboard/landlord/properties");
  revalidatePath(`/listings/${property.id}`);
  revalidatePath("/listings");

  return {
    success: true,
    message: "Listing updated.",
    propertyId: property.id,
  };
}
