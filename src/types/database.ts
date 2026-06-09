import type { ACTIVE_ROLES } from "@/constants/user-roles";

export type ActiveRole = (typeof ACTIVE_ROLES)[number];
export type WaitlistRole = "tenant" | "landlord";

export type PropertyStatus = "draft" | "published" | "archived" | "rented";

export type InquiryStatus = "pending" | "read" | "responded" | "closed";

export type TenancyVerificationSource = "manual" | "payment" | "admin";

export type ReviewStatus = "pending" | "published" | "hidden";

export type NotificationType = "new_inquiry" | "inquiry_reply" | "inquiry_closed";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_tenant: boolean;
  is_landlord: boolean;
  is_admin: boolean;
  active_role: ActiveRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyLocation = {
  id: string;
  created_by: string;
  address: string | null;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  owner_id: string;
  location_id: string | null;
  title: string;
  description: string | null;
  price: number;
  rent_period: "monthly" | "six_months" | "yearly";
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  storage_path: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
};

export type Inquiry = {
  id: string;
  property_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

export type InquiryReply = {
  id: string;
  inquiry_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export type PropertyTenancy = {
  id: string;
  property_id: string;
  tenant_id: string;
  landlord_id: string;
  is_verified: boolean;
  verified_at: string | null;
  verification_source: TenancyVerificationSource | null;
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyReview = {
  id: string;
  property_id: string;
  tenancy_id: string;
  reviewer_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  resource_id: string | null;
  resource_type: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          is_tenant?: boolean;
          is_landlord?: boolean;
          is_admin?: boolean;
          active_role?: ActiveRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          is_tenant?: boolean;
          is_landlord?: boolean;
          is_admin?: boolean;
          active_role?: ActiveRole;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      property_locations: {
        Row: PropertyLocation;
        Insert: {
          id?: string;
          created_by: string;
          address?: string | null;
          city: string;
          state: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          city?: string;
          state?: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: Property;
        Insert: {
          id?: string;
          owner_id: string;
          location_id?: string | null;
          title: string;
          description?: string | null;
          price: number;
          rent_period?: "monthly" | "six_months" | "yearly";
          property_type: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          status?: PropertyStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          location_id?: string | null;
          title?: string;
          description?: string | null;
          price?: number;
          rent_period?: "monthly" | "six_months" | "yearly";
          property_type?: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          status?: PropertyStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      property_images: {
        Row: PropertyImage;
        Insert: {
          id?: string;
          property_id: string;
          image_url: string;
          storage_path: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          image_url?: string;
          storage_path?: string;
          is_primary?: boolean;
          display_order?: number;
        };
        Relationships: [];
      };
      favorites: {
        Row: Favorite;
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      inquiries: {
        Row: Inquiry;
        Insert: {
          id?: string;
          property_id: string;
          sender_id: string;
          recipient_id: string;
          message: string;
          status?: InquiryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: InquiryStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiry_replies: {
        Row: InquiryReply;
        Insert: {
          id?: string;
          inquiry_id: string;
          sender_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          inquiry_id?: string;
          sender_id?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      property_tenancies: {
        Row: PropertyTenancy;
        Insert: {
          id?: string;
          property_id: string;
          tenant_id: string;
          landlord_id: string;
          is_verified?: boolean;
          verified_at?: string | null;
          verification_source?: TenancyVerificationSource | null;
          starts_on?: string | null;
          ends_on?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          property_id?: string;
          tenant_id?: string;
          landlord_id?: string;
          is_verified?: boolean;
          verified_at?: string | null;
          verification_source?: TenancyVerificationSource | null;
          starts_on?: string | null;
          ends_on?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      property_reviews: {
        Row: PropertyReview;
        Insert: {
          id?: string;
          property_id: string;
          tenancy_id: string;
          reviewer_id: string;
          rating: number;
          title?: string | null;
          body?: string | null;
          status?: ReviewStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rating?: number;
          title?: string | null;
          body?: string | null;
          status?: ReviewStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          is_read?: boolean;
          resource_id?: string | null;
          resource_type?: string | null;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
      waitlist_entries: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: WaitlistRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          role: WaitlistRole;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      active_role: ActiveRole;
      property_status: PropertyStatus;
      inquiry_status: InquiryStatus;
      notification_type: NotificationType;
      rent_period: "monthly" | "six_months" | "yearly";
      tenancy_verification_source: TenancyVerificationSource;
      review_status: ReviewStatus;
      waitlist_role: WaitlistRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
