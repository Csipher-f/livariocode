"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Loader2,
  Pencil,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createProperty } from "@/features/properties/actions/create-property";
import { updateProperty } from "@/features/properties/actions/update-property";
import {
  ImageUploader,
  type ImageUploaderValue,
} from "@/features/properties/components/image-uploader";
import {
  PROPERTY_TYPES,
  type LandlordProperty,
  type PropertyType,
} from "@/features/properties/types";
import { cn } from "@/lib/utils";

type FormMode = "create" | "edit";
type ListingStatus = "draft" | "published";
type StepId = 0 | 1 | 2 | 3 | 4;

type WizardValues = {
  title: string;
  propertyType: PropertyType;
  bedrooms: string;
  bathrooms: string;
  address: string;
  city: string;
  state: string;
  description: string;
  price: string;
  status: ListingStatus;
};

type WizardField = keyof WizardValues;
type FieldErrors = Partial<Record<WizardField, string>>;

const draftStorageKey = "livario:create-property-draft";

const steps: { id: StepId; label: string; description: string }[] = [
  { id: 0, label: "Basic Info", description: "Name the listing" },
  { id: 1, label: "Location", description: "Place it on the map" },
  { id: 2, label: "Details", description: "Set terms and story" },
  { id: 3, label: "Photos", description: "Add the visual proof" },
  { id: 4, label: "Review", description: "Confirm and publish" },
];

const basicInfoSchema = z.object({
  title: z.string().trim().min(3, "Add a title with at least 3 characters."),
  propertyType: z.enum(PROPERTY_TYPES),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
});

const locationSchema = z.object({
  address: z.string().trim().max(180, "Keep the address under 180 characters."),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
});

const detailsSchema = z.object({
  description: z
    .string()
    .trim()
    .max(2500, "Keep the description under 2,500 characters."),
  price: z.coerce.number().min(1, "Monthly price is required."),
  status: z.enum(["draft", "published"]),
});

const stepSchemas = [basicInfoSchema, locationSchema, detailsSchema] as const;

function getInitialImageState(property?: LandlordProperty): ImageUploaderValue {
  const primaryImage = property?.images.find((image) => image.isPrimary);

  return {
    newImages: [],
    removedImageIds: [],
    primaryImageKey: primaryImage ? `existing:${primaryImage.id}` : "",
    existingImageOrder: property?.images.map((image) => image.id) ?? [],
  };
}

function getInitialValues(property?: LandlordProperty): WizardValues {
  return {
    title: property?.title ?? "",
    propertyType:
      PROPERTY_TYPES.find((type) => type === property?.propertyType) ??
      "Apartment",
    bedrooms: String(property?.bedrooms ?? 0),
    bathrooms: String(property?.bathrooms ?? 0),
    address: property?.location?.address ?? "",
    city: property?.location?.city ?? "",
    state: property?.location?.state ?? "",
    description: property?.description ?? "",
    price: property?.price ? String(property.price) : "",
    status: property?.status === "published" ? "published" : "draft",
  };
}

function getFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  error.issues.forEach((issue) => {
    const key = issue.path[0];

    if (typeof key === "string" && key in getInitialValues()) {
      fieldErrors[key as WizardField] = issue.message;
    }
  });

  return fieldErrors;
}

function formatCurrency(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function readDraft(): WizardValues | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawDraft = window.localStorage.getItem(draftStorageKey);

    if (!rawDraft) {
      return null;
    }

    const parsedDraft = JSON.parse(rawDraft) as Partial<WizardValues>;

    return {
      ...getInitialValues(),
      ...parsedDraft,
      propertyType: PROPERTY_TYPES.includes(
        parsedDraft.propertyType as PropertyType
      )
        ? (parsedDraft.propertyType as PropertyType)
        : "Apartment",
      status: parsedDraft.status === "published" ? "published" : "draft",
    };
  } catch {
    return null;
  }
}

export function PropertyForm({
  mode,
  property,
}: {
  mode: FormMode;
  property?: LandlordProperty;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isCreateMode = mode === "create";
  const [step, setStep] = useState<StepId>(0);
  const [values, setValues] = useState<WizardValues>(() =>
    getInitialValues(property)
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [draftPrompt, setDraftPrompt] = useState(false);
  const [savedDraft, setSavedDraft] = useState<WizardValues | null>(null);
  const [imageState, setImageState] = useState<ImageUploaderValue>(() =>
    getInitialImageState(property)
  );
  const existingImages = useMemo(() => property?.images ?? [], [property]);
  const visibleExistingImages = existingImages.filter(
    (image) => !imageState.removedImageIds.includes(image.id)
  );
  const reviewImages = [
    ...visibleExistingImages.map((image) => ({
      key: `existing:${image.id}`,
      src: image.imageUrl,
    })),
    ...imageState.newImages.map((image, index) => ({
      key: `new:${index}`,
      src: image.previewUrl,
    })),
  ];

  useEffect(() => {
    if (!isCreateMode) {
      return;
    }

    const timer = window.setTimeout(() => {
      const draft = readDraft();

      if (draft) {
        setSavedDraft(draft);
        setDraftPrompt(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isCreateMode]);

  useEffect(() => {
    if (!isCreateMode || draftPrompt) {
      return;
    }

    window.localStorage.setItem(draftStorageKey, JSON.stringify(values));
  }, [draftPrompt, isCreateMode, values]);

  function updateValue<Field extends WizardField>(
    field: Field,
    value: WizardValues[Field]
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function validateStep(targetStep = step) {
    const schema = stepSchemas[targetStep as 0 | 1 | 2];

    if (!schema) {
      return true;
    }

    const result = schema.safeParse(values);

    if (!result.success) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        ...getFieldErrors(result.error),
      }));
      return false;
    }

    setFieldErrors({});
    return true;
  }

  function goToStep(targetStep: StepId) {
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }

    for (let index = step; index < targetStep; index += 1) {
      if (!validateStep(index as StepId)) {
        setStep(index as StepId);
        return;
      }
    }

    setStep(targetStep);
  }

  function handleNext() {
    if (!validateStep()) {
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, 4) as StepId);
  }

  function clearDraft() {
    window.localStorage.removeItem(draftStorageKey);
    setDraftPrompt(false);
    setSavedDraft(null);
  }

  function restoreDraft() {
    if (savedDraft) {
      setValues(savedDraft);
    }

    setDraftPrompt(false);
  }

  function handleSubmit(status: ListingStatus) {
    const basicResult = basicInfoSchema.safeParse(values);
    const locationResult = locationSchema.safeParse(values);
    const detailsResult = detailsSchema.safeParse({ ...values, status });

    if (!basicResult.success) {
      setStep(0);
      setFieldErrors(getFieldErrors(basicResult.error));
      return;
    }

    if (!locationResult.success) {
      setStep(1);
      setFieldErrors(getFieldErrors(locationResult.error));
      return;
    }

    if (!detailsResult.success) {
      setStep(2);
      setFieldErrors(getFieldErrors(detailsResult.error));
      return;
    }

    const formData = new FormData();

    Object.entries({ ...values, status }).forEach(([key, value]) => {
      formData.set(key, value);
    });
    imageState.newImages.forEach((image) => {
      formData.append("images", image.file);
    });
    imageState.removedImageIds.forEach((id) => {
      formData.append("removedImageIds", id);
    });
    imageState.existingImageOrder.forEach((id) => {
      formData.append("existingImageOrder", id);
    });
    formData.set("primaryImageKey", imageState.primaryImageKey);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProperty(formData)
          : property
            ? await updateProperty(property.id, formData)
            : {
                success: false as const,
                message: "This listing could not be found.",
              };

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setServerMessage(result.message);
        toast({
          title: "Listing not saved",
          description: result.message,
          intent: "destructive",
        });
        return;
      }

      if (isCreateMode) {
        window.localStorage.removeItem(draftStorageKey);
      }

      toast({
        title: mode === "create" ? "Listing created" : "Listing updated",
        description: result.message,
        intent: "success",
      });
      router.push("/dashboard/landlord/properties");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6">
      {draftPrompt ? (
        <div className="rounded-md border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Restore previous draft?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We found saved listing details on this device.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={clearDraft} type="button" variant="outline">
                Start fresh
              </Button>
              <Button onClick={restoreDraft} type="button">
                <RotateCcw className="size-4" />
                Restore
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {steps.map((wizardStep) => {
            const isCurrent = wizardStep.id === step;
            const isComplete = wizardStep.id < step;

            return (
              <button
                className="group grid gap-2 text-left"
                disabled={wizardStep.id > step}
                key={wizardStep.id}
                onClick={() => goToStep(wizardStep.id)}
                type="button"
              >
                <span
                  className={cn(
                    "flex h-9 items-center justify-center rounded-4xl border text-sm font-medium transition",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    isComplete && "border-primary/20 bg-primary/10 text-primary",
                    !isCurrent &&
                      !isComplete &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="size-4" /> : wizardStep.id + 1}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-sm font-medium">
                    {wizardStep.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {wizardStep.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div
          className="grid gap-6 p-5 transition-all duration-300 ease-out sm:p-6"
          key={step}
        >
          {step === 0 ? (
            <WizardSection
              eyebrow="Step 1"
              title="Basic info"
              subtitle="Start with the facts tenants scan first."
            >
              <Field label="Property title" error={fieldErrors.title}>
                <Input
                  aria-invalid={Boolean(fieldErrors.title)}
                  disabled={isPending}
                  id="title"
                  onChange={(event) => updateValue("title", event.target.value)}
                  placeholder="Modern apartment in Lekki"
                  value={values.title}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Property type">
                  <Select
                    disabled={isPending}
                    onValueChange={(value) =>
                      updateValue("propertyType", value as PropertyType)
                    }
                    value={values.propertyType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Bedrooms" error={fieldErrors.bedrooms}>
                  <Input
                    aria-invalid={Boolean(fieldErrors.bedrooms)}
                    disabled={isPending}
                    min={0}
                    onChange={(event) =>
                      updateValue("bedrooms", event.target.value)
                    }
                    type="number"
                    value={values.bedrooms}
                  />
                </Field>
                <Field label="Bathrooms" error={fieldErrors.bathrooms}>
                  <Input
                    aria-invalid={Boolean(fieldErrors.bathrooms)}
                    disabled={isPending}
                    min={0}
                    onChange={(event) =>
                      updateValue("bathrooms", event.target.value)
                    }
                    type="number"
                    value={values.bathrooms}
                  />
                </Field>
              </div>
            </WizardSection>
          ) : null}

          {step === 1 ? (
            <WizardSection
              eyebrow="Step 2"
              title="Location"
              subtitle="Keep it precise enough to build trust."
            >
              <Field label="Address" error={fieldErrors.address}>
                <Input
                  aria-invalid={Boolean(fieldErrors.address)}
                  disabled={isPending}
                  onChange={(event) => updateValue("address", event.target.value)}
                  placeholder="Street address"
                  value={values.address}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" error={fieldErrors.city}>
                  <Input
                    aria-invalid={Boolean(fieldErrors.city)}
                    disabled={isPending}
                    onChange={(event) => updateValue("city", event.target.value)}
                    value={values.city}
                  />
                </Field>
                <Field label="State" error={fieldErrors.state}>
                  <Input
                    aria-invalid={Boolean(fieldErrors.state)}
                    disabled={isPending}
                    onChange={(event) => updateValue("state", event.target.value)}
                    value={values.state}
                  />
                </Field>
              </div>
            </WizardSection>
          ) : null}

          {step === 2 ? (
            <WizardSection
              eyebrow="Step 3"
              title="Details"
              subtitle="Set the price, listing state, and richer context."
            >
              <Field label="Description" error={fieldErrors.description}>
                <Textarea
                  aria-invalid={Boolean(fieldErrors.description)}
                  disabled={isPending}
                  onChange={(event) =>
                    updateValue("description", event.target.value)
                  }
                  placeholder="Describe the space, neighborhood, and ideal tenant."
                  value={values.description}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Price per month" error={fieldErrors.price}>
                  <Input
                    aria-invalid={Boolean(fieldErrors.price)}
                    disabled={isPending}
                    min={1}
                    onChange={(event) => updateValue("price", event.target.value)}
                    type="number"
                    value={values.price}
                  />
                </Field>
                <Field label="Status">
                  <Select
                    disabled={isPending}
                    onValueChange={(value) =>
                      updateValue("status", value as ListingStatus)
                    }
                    value={values.status}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </WizardSection>
          ) : null}

          {step === 3 ? (
            <WizardSection
              eyebrow="Step 4"
              title="Photos"
              subtitle="Lead with the strongest image and keep the gallery tidy."
            >
              <ImageUploader
                disabled={isPending}
                existingImages={existingImages}
                onChange={setImageState}
                value={imageState}
              />
            </WizardSection>
          ) : null}

          {step === 4 ? (
            <WizardSection
              eyebrow="Step 5"
              title="Review"
              subtitle="One calm pass before this goes live."
            >
              <ReviewSection
                onEdit={() => setStep(0)}
                title="Basic info"
                rows={[
                  ["Title", values.title || "Not set"],
                  ["Type", values.propertyType],
                  ["Bedrooms", values.bedrooms],
                  ["Bathrooms", values.bathrooms],
                ]}
              />
              <ReviewSection
                onEdit={() => setStep(1)}
                title="Location"
                rows={[
                  ["Address", values.address || "Not set"],
                  ["City", values.city || "Not set"],
                  ["State", values.state || "Not set"],
                ]}
              />
              <ReviewSection
                onEdit={() => setStep(2)}
                title="Details"
                rows={[
                  ["Price", formatCurrency(values.price)],
                  ["Status", values.status === "published" ? "Published" : "Draft"],
                  ["Description", values.description || "Not set"],
                ]}
              />
              <div className="rounded-md border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium">Photos</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {reviewImages.length} of 10 images
                    </p>
                  </div>
                  <Button onClick={() => setStep(3)} size="sm" type="button" variant="outline">
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                </div>
                {reviewImages.length > 0 ? (
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {reviewImages.map((image) => (
                      <div
                        className="relative aspect-square overflow-hidden rounded-md bg-secondary"
                        key={image.key}
                      >
                        <Image
                          alt=""
                          className="object-cover"
                          fill
                          sizes="120px"
                          src={image.src}
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No photos added yet.
                  </p>
                )}
              </div>
              {serverMessage ? (
                <p className="text-sm text-destructive">{serverMessage}</p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  disabled={isPending}
                  onClick={() => handleSubmit("draft")}
                  type="button"
                  variant="outline"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : <Home className="size-4" />}
                  Save as Draft
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => handleSubmit("published")}
                  type="button"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Publish Listing
                </Button>
              </div>
            </WizardSection>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {isCreateMode ? (
            <Button onClick={clearDraft} type="button" variant="ghost">
              <Trash2 className="size-4" />
              Clear draft
            </Button>
          ) : null}
        </div>
        <div className="flex gap-3">
          <Button
            disabled={isPending || step === 0}
            onClick={() => setStep((currentStep) => Math.max(currentStep - 1, 0) as StepId)}
            type="button"
            variant="outline"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          {step < 4 ? (
            <Button disabled={isPending} onClick={handleNext} type="button">
              Next
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WizardSection({
  children,
  eyebrow,
  subtitle,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  subtitle: string;
  title: string;
}) {
  return (
    <section className="animate-in fade-in-0 slide-in-from-right-2 grid gap-5 duration-300">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function ReviewSection({
  onEdit,
  rows,
  title,
}: {
  onEdit: () => void;
  rows: [string, string][];
  title: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button onClick={onEdit} size="sm" type="button" variant="outline">
          <Pencil className="size-4" />
          Edit
        </Button>
      </div>
      <dl className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4" key={label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
