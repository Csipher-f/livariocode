import type { PropertyStatus } from "@/types/database";

export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Self-contain",
  "Studio",
  "Duplex",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export type PropertyFilters = {
  city?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page: number;
};

export type PropertyListing = {
  id: string;
  title: string;
  price: number;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: PropertyStatus;
  location: {
    city: string;
    state: string;
  } | null;
  primaryImageUrl: string | null;
};

export type PaginatedProperties = {
  properties: PropertyListing[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
