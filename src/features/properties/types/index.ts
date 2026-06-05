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
  rentPeriod: "monthly" | "six_months" | "yearly";
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: PropertyStatus;
  location: {
    city: string;
    state: string;
  } | null;
  primaryImageUrl: string | null;
  isFavorited?: boolean;
};

export type PropertyDetailImage = {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type PropertyDetail = {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  price: number;
  rentPeriod: "monthly" | "six_months" | "yearly";
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: PropertyStatus;
  createdAt: string;
  amenities: string[];
  location: {
    address: string | null;
    city: string;
    state: string;
    country: string;
  } | null;
  images: PropertyDetailImage[];
  landlord: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    createdAt: string | null;
  };
};

export type LandlordPropertyImage = {
  id: string;
  imageUrl: string;
  storagePath: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type LandlordProperty = {
  id: string;
  ownerId: string;
  locationId: string | null;
  title: string;
  description: string | null;
  price: number;
  rentPeriod: "monthly" | "six_months" | "yearly";
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  location: {
    id: string;
    address: string | null;
    city: string;
    state: string;
    country: string;
  } | null;
  images: LandlordPropertyImage[];
};

export type LandlordPropertiesResult = {
  properties: LandlordProperty[];
  stats: {
    totalListings: number;
    publishedListings: number;
    draftListings: number;
  };
};

export type PaginatedProperties = {
  properties: PropertyListing[];
  isAuthenticated: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
