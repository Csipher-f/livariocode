Livario Authentication Architecture

Overview

Livario authentication is designed to be:

- secure
- scalable
- SSR-compatible
- production-grade
- mobile-friendly
- future-proof

Authentication must feel invisible, stable, and reliable for users.

The architecture should support:

- tenants
- landlords
- future admin roles
- future subscription systems
- future billing systems

without requiring major rewrites.

---

Authentication Stack

Provider

Supabase Authentication

Framework

Next.js 16 App Router

Session Strategy

SSR-compatible session handling using modern Supabase patterns.

---

Authentication Goals

The authentication system must:

- support persistent sessions
- avoid hydration issues
- work correctly with Server Components
- support protected routes
- support future role expansion
- maintain security best practices
- avoid duplicated auth logic
- remain simple and maintainable

---

Supported Authentication Features

Phase 1 Features

Email Authentication

- signup
- login
- logout
- forgot password
- password reset

Session Management

- persistent sessions
- secure cookies
- SSR session validation

User Profiles

- profile creation
- avatar support later
- onboarding support later

Route Protection

- protected dashboard routes
- authenticated-only actions
- ownership validation

---

Future Authentication Features

These are NOT Phase 1 priorities but architecture should remain compatible.

Future Features

- OAuth providers
- Google login
- role-based permissions
- admin authentication
- subscription access control
- multi-device session management

---

Authentication Philosophy

Simplicity First

Avoid:

- overly complicated auth abstractions
- unnecessary providers
- duplicated hooks/utilities
- auth logic scattered across the app

Prefer:

- centralized auth utilities
- server-first authentication
- reusable session validation helpers

---

Server vs Client Rules

Server Components Preferred

Authentication checks should primarily happen:

- on the server
- in layouts
- in middleware
- in protected server routes

Avoid relying entirely on client-side auth validation.

---

Client Components

Client-side auth should only handle:

- form interactions
- UI state
- optimistic UX where appropriate

Client components should NOT become the source of truth for authentication security.

---

Supabase Client Architecture

Required Clients

Browser Client

Used for:

- client-side auth interactions
- form submissions
- realtime later

Server Client

Used for:

- protected server actions
- SSR auth validation
- secure queries

Middleware Client

Used for:

- route protection
- session refreshing
- redirect handling

---

Recommended Folder Structure

lib/
└── supabase/
├── browser-client.ts
├── server-client.ts
├── middleware-client.ts
└── auth.ts

---

Session Management Strategy

Requirements

Sessions must:

- persist correctly
- refresh automatically
- remain SSR-compatible
- avoid hydration mismatches

---

Session Ownership

Server-side validation is the source of truth.

Never trust:

- local storage alone
- client-side role assumptions
- unvalidated frontend state

---

Protected Route Strategy

Public Routes

Examples:

- homepage
- listings
- property details
- auth pages

---

Protected Routes

Examples:

- dashboard
- saved listings
- property management
- profile settings

---

Middleware Strategy

Middleware should:

- refresh sessions
- protect routes
- redirect unauthorized users
- avoid unnecessary logic

Middleware should remain lightweight.

---

User Roles

Initial Roles

Tenant

Default user type.

Can:

- browse listings
- save listings
- contact landlords

---

Landlord

Property owner role.

Can:

- create listings
- manage listings
- receive inquiries

---

Role Architecture Philosophy

Even if roles are simple initially:

- architecture must remain expandable
- permissions should remain centralized
- avoid hardcoded scattered role checks

---

User Profile Architecture

Authentication users and profile data should remain separated.

Supabase Auth

Stores:

- authentication identity
- email
- password

Profiles Table

Stores:

- display name
- role
- avatar
- preferences
- metadata

---

Route Architecture

Public Routes

/
/listings
/listing/[id]
/login
/signup

Protected Routes

/dashboard
/dashboard/properties
/dashboard/saved
/settings

---

Authentication UI Standards

Authentication UI should feel:

- clean
- minimal
- trustworthy
- modern

Inspired by:

- Airbnb
- Apple
- Linear

---

Form Standards

Authentication forms must include:

- validation
- loading states
- disabled states
- error handling
- accessible labels

---

Error Handling Philosophy

Errors should:

- feel human
- remain concise
- avoid technical jargon
- avoid exposing sensitive details

---

Security Standards

Never Expose

- service role keys
- private secrets
- admin credentials

---

Always Validate

- authenticated ownership
- protected actions
- user permissions

---

Row Level Security Philosophy

Every user-owned resource must use:

- ownership policies
- authenticated access checks

Avoid insecure frontend-only authorization.

---

Password Reset Flow

Flow should include:

1. forgot password request
2. secure reset email
3. reset confirmation page
4. secure password update

---

Redirect Strategy

Authenticated Users

Should not access:

- login page
- signup page

Redirect appropriately.

---

Unauthenticated Users

Should not access:

- dashboards
- protected actions

Redirect to login.

---

Future Scalability

Authentication architecture should support:

- subscription systems
- admin dashboards
- billing permissions
- property teams later
- organization support later

without major rewrites.

---

Performance Considerations

Authentication should:

- minimize unnecessary requests
- avoid repeated session checks
- remain lightweight
- avoid excessive client-side state

---

Engineering Principles

Authentication architecture must remain:

- centralized
- maintainable
- secure
- SSR-compatible
- scalable
- understandable

Avoid auth chaos at all costs.

---

Final Principle

Authentication is infrastructure.

It should feel:

- invisible to users
- predictable for developers
- scalable for the business
- secure in production

A clean authentication system creates stability for the entire Livario platform.
