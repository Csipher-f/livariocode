Livario Database Architecture

Overview

Livario uses PostgreSQL through Supabase as the primary database infrastructure.

The database architecture must prioritize:

- scalability
- simplicity
- security
- maintainability
- performance
- future expansion

The schema should support both:

- current Phase 1 housing discovery
- future Phase 2 rent-tech systems

without unnecessary overengineering.

---

Database Philosophy

Livario’s database should:

- remain normalized where appropriate
- avoid premature complexity
- maintain clean relationships
- use clear ownership models
- support Row Level Security
- support future scaling

Avoid:

- deeply coupled tables
- excessive joins where unnecessary
- duplicated ownership logic
- unclear relationships

---

Database Provider

Platform

Supabase PostgreSQL

Features Used

- PostgreSQL
- Row Level Security
- Storage
- Auth integration
- SQL migrations

---

Core Data Principles

Source of Truth

The database is the source of truth.

Frontend state should never become the authoritative source for:

- permissions
- ownership
- listing status
- user roles

---

Ownership-Based Access

Every user-owned resource must:

- clearly define ownership
- support RLS policies
- validate authenticated access

---

Phase 1 Database Scope

Included

Users & Profiles

- auth users
- profile metadata
- user roles

Properties

- property listings
- property metadata
- pricing
- listing status

Property Images

- uploaded property media
- thumbnails later

Favorites

- saved properties

Inquiries

- tenant → landlord communication

---

Excluded From Phase 1

Do NOT implement:

- subscriptions
- invoices
- recurring billing
- financial ledgers
- payment history
- escrow systems
- advanced analytics

---

Core Database Tables

---

1. profiles

Purpose

Stores public and platform-specific user information.

Relationship

Connected to Supabase auth users.

---

Responsibilities

- display name
- user role
- avatar
- onboarding data later
- account metadata

---

Important Fields

id
email
full_name
role
avatar_url
created_at
updated_at

---

Role Types

tenant

Default role.

landlord

Property owner role.

admin

Future internal role.

---

2. properties

Purpose

Stores property listings.

---

Responsibilities

- property ownership
- listing data
- pricing
- availability
- property metadata

---

Important Fields

id
owner_id
title
description
price
property_type
bedrooms
bathrooms
location_id
status
created_at
updated_at

---

Property Status Values

draft
published
archived
rented

---

3. property_images

Purpose

Stores property media references.

---

Responsibilities

- image ordering
- storage references
- primary image tracking

---

Important Fields

id
property_id
image_url
storage_path
is_primary
display_order
created_at

---

4. property_locations

Purpose

Separates location metadata from property core data.

---

Responsibilities

- address
- city
- state
- country
- coordinates later

---

Important Fields

id
address
city
state
country
latitude
longitude

---

5. favorites

Purpose

Stores saved listings for users.

---

Responsibilities

- user favorites
- saved listing tracking

---

Important Fields

id
user_id
property_id
created_at

---

6. inquiries

Purpose

Stores tenant inquiries to landlords.

---

Responsibilities

- property inquiries
- landlord communication
- inquiry tracking

---

Important Fields

id
property_id
sender_id
recipient_id
message
status
created_at

---

Inquiry Status Values

pending
read
responded
closed

---

Relationships

User Relationships

profiles.id
↓
properties.owner_id
↓
property_images.property_id

---

Favorites Relationship

profiles.id
↓
favorites.user_id

properties.id
↓
favorites.property_id

---

Inquiry Relationship

profiles.id
↓
inquiries.sender_id

profiles.id
↓
inquiries.recipient_id

properties.id
↓
inquiries.property_id

---

Row Level Security (RLS)

Philosophy

RLS is mandatory.

Never rely solely on frontend authorization.

---

Ownership Rules

Profiles

Users can:

- read own profile
- update own profile

---

Properties

Landlords can:

- create own listings
- edit own listings
- delete own listings

Public users can:

- view published listings

---

Favorites

Users can:

- manage only their own favorites

---

Inquiries

Users can:

- view only conversations involving themselves

---

Migration Strategy

Use SQL migration files for:

- schema changes
- policy changes
- indexes
- triggers later

Avoid manual production database editing.

---

Indexing Strategy

Add indexes for:

- property search
- filtering
- owner queries
- favorites
- inquiries

---

Important Indexed Fields

properties.owner_id
properties.status
property_locations.city
favorites.user_id
inquiries.recipient_id

---

Search & Filtering Philosophy

Phase 1 search should support:

- city
- property type
- price
- bedrooms
- listing status

Avoid overengineering search initially.

---

File Upload Philosophy

Images should:

- use Supabase Storage
- remain organized by property
- support optimization later

---

Suggested Storage Structure

properties/
property-id/
image-1.jpg
image-2.jpg

---

Soft Delete Philosophy

Avoid permanent deletion where appropriate.

Future support may include:

- archived listings
- restored listings
- moderation systems

---

Timestamps

All major tables should include:

created_at
updated_at

Use consistent timestamp standards.

---

Future Database Expansion

Architecture should support future:

- payment systems
- subscriptions
- invoices
- rent history
- analytics
- notifications
- admin systems

without major schema rewrites.

---

Performance Philosophy

Prioritize:

- efficient queries
- indexed lookups
- minimized unnecessary joins
- pagination
- scalable listing retrieval

Avoid:

- loading excessive relational data
- oversized payloads
- inefficient client-side filtering

---

Security Philosophy

Never expose:

- sensitive internal data
- unauthorized records
- admin-only metadata

Always validate:

- ownership
- authenticated access
- protected actions

---

Database Naming Standards

Use:

- snake_case
- singular table references in relationships
- consistent naming patterns

Avoid:

- vague names
- inconsistent casing
- unclear ownership references

---

Engineering Principles

The database should feel:

- predictable
- scalable
- secure
- understandable

Future developers should quickly understand:

- ownership
- relationships
- permissions
- data flow

---

Final Principle

Livario’s database is long-term infrastructure.

It must support:

- clean product evolution
- stable scaling
- future rent-tech expansion
- secure multi-user operations

while remaining simple enough for rapid startup iteration.
