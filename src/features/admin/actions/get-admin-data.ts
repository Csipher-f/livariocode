import "server-only";

import { createClient } from "@/supabase/server-client";
import type { InquiryStatus, Profile, PropertyStatus } from "@/types/database";

export const ADMIN_PAGE_SIZE = 20;

export type AdminPropertyStatusFilter = "all" | PropertyStatus;
export type AdminInquiryStatusFilter = "all" | InquiryStatus;

export type AdminOverviewStats = {
  totalPublishedProperties: number;
  totalUsers: number;
  totalInquiries: number;
  newUsersThisWeek: number;
  pendingReviews: number;
};

export type AdminPropertyRow = {
  id: string;
  title: string;
  ownerName: string;
  ownerEmail: string | null;
  status: PropertyStatus;
  propertyType: string;
  city: string;
  createdAt: string;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string | null;
  isTenant: boolean;
  isLandlord: boolean;
  joinedAt: string;
};

export type AdminUserDetail = AdminUserRow & {
  isAdmin: boolean;
  avatarUrl: string | null;
  activeRole: string;
  updatedAt: string;
};

export type AdminInquiryRow = {
  id: string;
  propertyTitle: string;
  senderName: string;
  recipientName: string;
  status: InquiryStatus;
  createdAt: string;
};

export type AdminPaginatedResult<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

function getRange(page: number) {
  const start = (page - 1) * ADMIN_PAGE_SIZE;

  return {
    start,
    end: start + ADMIN_PAGE_SIZE - 1,
  };
}

function normalizePage(page?: string | string[]) {
  const value = Array.isArray(page) ? page[0] : page;
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function normalizeSearch(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;

  return raw?.trim() || "";
}

export function parseAdminPageParam(page?: string | string[]) {
  return normalizePage(page);
}

export function parseAdminSearchParam(search?: string | string[]) {
  return normalizeSearch(search);
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const supabase = await createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    publishedProperties,
    users,
    inquiries,
    newUsersThisWeek,
    pendingReviews,
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("property_reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    totalPublishedProperties: publishedProperties.count ?? 0,
    totalUsers: users.count ?? 0,
    totalInquiries: inquiries.count ?? 0,
    newUsersThisWeek: newUsersThisWeek.count ?? 0,
    pendingReviews: pendingReviews.count ?? 0,
  };
}

export async function getAdminProperties({
  page,
  search,
  status,
}: {
  page: number;
  search: string;
  status: AdminPropertyStatusFilter;
}): Promise<AdminPaginatedResult<AdminPropertyRow>> {
  const supabase = await createClient();
  const { start, end } = getRange(page);

  let query = supabase
    .from("properties")
    .select("id,owner_id,location_id,title,status,property_type,created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data: properties, count } = await query;
  const ownerIds = [...new Set((properties ?? []).map((row) => row.owner_id))];
  const locationIds = [
    ...new Set((properties ?? []).flatMap((row) => row.location_id ?? [])),
  ];

  const [ownersResult, locationsResult] = await Promise.all([
    ownerIds.length
      ? supabase.from("profiles").select("id,full_name,email").in("id", ownerIds)
      : Promise.resolve({ data: [] as Pick<Profile, "id" | "full_name" | "email">[] }),
    locationIds.length
      ? supabase.from("property_locations").select("id,city").in("id", locationIds)
      : Promise.resolve({ data: [] as { id: string; city: string }[] }),
  ]);

  const owners = new Map(
    (ownersResult.data ?? []).map((owner) => [owner.id, owner])
  );
  const locations = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location])
  );

  return {
    rows: (properties ?? []).map((property) => {
      const owner = owners.get(property.owner_id);
      const location = property.location_id
        ? locations.get(property.location_id)
        : null;

      return {
        id: property.id,
        title: property.title,
        ownerName: owner?.full_name ?? "Livario user",
        ownerEmail: owner?.email ?? null,
        status: property.status,
        propertyType: property.property_type,
        city: location?.city ?? "Unknown city",
        createdAt: property.created_at,
      };
    }),
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / ADMIN_PAGE_SIZE),
  };
}

export async function getAdminUsers({
  page,
  search,
}: {
  page: number;
  search: string;
}): Promise<AdminPaginatedResult<AdminUserRow>> {
  const supabase = await createClient();
  const { start, end } = getRange(page);

  let query = supabase
    .from("profiles")
    .select("id,full_name,email,is_tenant,is_landlord,created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, count } = await query;

  return {
    rows: (data ?? []).map((profile) => ({
      id: profile.id,
      name: profile.full_name ?? "Livario user",
      email: profile.email,
      isTenant: profile.is_tenant,
      isLandlord: profile.is_landlord,
      joinedAt: profile.created_at,
    })),
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / ADMIN_PAGE_SIZE),
  };
}

export async function getAdminUser(userId: string): Promise<AdminUserDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id,full_name,email,is_tenant,is_landlord,is_admin,active_role,avatar_url,created_at,updated_at"
    )
    .eq("id", userId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.full_name ?? "Livario user",
    email: data.email,
    isTenant: data.is_tenant,
    isLandlord: data.is_landlord,
    isAdmin: data.is_admin,
    avatarUrl: data.avatar_url,
    activeRole: data.active_role,
    joinedAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getAdminInquiries({
  page,
  status,
}: {
  page: number;
  status: AdminInquiryStatusFilter;
}): Promise<AdminPaginatedResult<AdminInquiryRow>> {
  const supabase = await createClient();
  const { start, end } = getRange(page);

  let query = supabase
    .from("inquiries")
    .select("id,property_id,sender_id,recipient_id,status,created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: inquiries, count } = await query;
  const propertyIds = [
    ...new Set((inquiries ?? []).map((row) => row.property_id)),
  ];
  const profileIds = [
    ...new Set(
      (inquiries ?? []).flatMap((row) => [row.sender_id, row.recipient_id])
    ),
  ];

  const [propertiesResult, profilesResult] = await Promise.all([
    propertyIds.length
      ? supabase.from("properties").select("id,title").in("id", propertyIds)
      : Promise.resolve({ data: [] as { id: string; title: string }[] }),
    profileIds.length
      ? supabase.from("profiles").select("id,full_name,email").in("id", profileIds)
      : Promise.resolve({ data: [] as Pick<Profile, "id" | "full_name" | "email">[] }),
  ]);

  const properties = new Map(
    (propertiesResult.data ?? []).map((property) => [property.id, property])
  );
  const profiles = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.id, profile])
  );

  return {
    rows: (inquiries ?? []).map((inquiry) => ({
      id: inquiry.id,
      propertyTitle:
        properties.get(inquiry.property_id)?.title ?? "Untitled listing",
      senderName:
        profiles.get(inquiry.sender_id)?.full_name ??
        profiles.get(inquiry.sender_id)?.email ??
        "Livario user",
      recipientName:
        profiles.get(inquiry.recipient_id)?.full_name ??
        profiles.get(inquiry.recipient_id)?.email ??
        "Livario user",
      status: inquiry.status,
      createdAt: inquiry.created_at,
    })),
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / ADMIN_PAGE_SIZE),
  };
}
