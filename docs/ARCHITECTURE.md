Livario Technical Architecture

Overview

Livario is built using a modern full-stack architecture focused on:

- scalability
- maintainability
- performance
- simplicity
- production readiness

The architecture prioritizes:

- server-first rendering
- modular feature organization
- reusable systems
- clean separation of concerns
- mobile-first user experience

Livario should feel:

- fast
- modern
- stable
- premium
- scalable

at every stage of growth.

---

Core Technology Stack

Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend

- Supabase
- PostgreSQL
- Row Level Security
- Supabase Storage

Deployment

- Vercel

---

Architecture Philosophy

Simplicity First

Avoid:

- unnecessary abstractions
- premature optimization
- deeply nested architecture
- excessive global state
- overengineered patterns

Prefer:

- clear ownership
- reusable systems
- feature organization
- server-first architecture
- maintainable patterns

---

Source Directory Structure

Livario uses the modern Next.js "src/" directory structure.

---

Root Structure

docs/
public/
src/
├── app/
├── actions/
├── components/
├── constants/
├── features/
├── hooks/
├── lib/
├── styles/
├── supabase/
├── types/

---

Folder Responsibilities

---

src/app

Contains:

- App Router pages
- layouts
- route groups
- loading states
- error states
- route handlers

This is the application entry layer.

Avoid placing large business logic directly here.

---

src/actions

Contains:

- Server Actions
- database mutations
- backend interaction logic

Responsibilities:

- form submissions
- secure mutations
- protected backend operations

Keep actions:

- focused
- validated
- reusable

---

src/components

Contains globally reusable UI components.

Examples:

- buttons
- cards
- modals
- inputs
- navigation
- loaders

Rules:

- reusable only
- presentation-focused
- avoid feature-specific business logic

---

src/constants

Contains:

- enums
- static configuration
- application constants

Examples:

- property types
- navigation links
- role mode constants

Role constants must reflect Livario's dual-role profile model:

- is_tenant boolean
- is_landlord boolean
- active_role: tenant or landlord

Do not model tenant and landlord as one locked role field.

---

src/features

Feature-oriented architecture.

Each feature should encapsulate:

- UI
- hooks
- actions
- utilities
- business logic

---

Example Feature Structure

features/
└── properties/
├── components/
├── actions/
├── hooks/
├── utils/
├── types/
└── services/

This improves:

- scalability
- ownership clarity
- maintainability

---

src/hooks

Contains reusable React hooks.

Examples:

- media queries
- UI utilities
- reusable interaction logic

Avoid:

- large business logic hooks
- duplicated state logic

---

src/lib

Contains:

- helper utilities
- shared functions
- configuration helpers
- core utilities

Examples:

- formatting
- validation
- utility functions

---

src/styles

Contains:

- global styles
- Tailwind layers
- design tokens later

---

src/supabase

Contains:

- Supabase clients
- auth helpers
- database integration utilities

Examples:

- browser client
- server client
- middleware client

---

src/types

Contains:

- global TypeScript types
- shared interfaces
- reusable type definitions

---

Rendering Strategy

Server Components First

Livario should default to:

- Server Components
- server-side data fetching
- server rendering

Benefits:

- improved performance
- smaller client bundles
- better SEO
- improved scalability

---

Client Components Rules

Use Client Components ONLY when necessary.

Examples:

- form interactivity
- local UI state
- animations
- browser APIs

Avoid unnecessary ""use client"" usage.

---

Data Fetching Strategy

Prefer:

- server-side fetching
- async Server Components
- cached data where appropriate

Avoid:

- unnecessary client-side fetching
- duplicated fetch requests

---

Server Actions Philosophy

Use Server Actions for:

- secure mutations
- form submissions
- database writes
- authenticated operations

Benefits:

- simplified architecture
- reduced API boilerplate
- improved security

---

API Architecture

Prefer:

- Server Actions
- route handlers only when necessary

Avoid building unnecessary REST complexity.

---

Authentication Architecture

Authentication uses:

- Supabase Auth
- SSR-compatible session handling
- middleware protection

---

Auth Client Structure

src/supabase/
├── browser-client.ts
├── server-client.ts
├── middleware-client.ts
└── auth.ts

---

Authentication Rules

Server-First Validation

Authentication checks should happen:

- on the server
- in middleware
- in protected layouts

Never trust client-only auth state.

---

Middleware Responsibilities

Middleware should:

- refresh sessions
- protect routes
- redirect unauthorized users

Keep middleware lightweight.

---

Database Architecture

Livario uses:

- PostgreSQL
- relational schema design
- Row Level Security

---

Database Philosophy

Prioritize:

- ownership clarity
- normalized relationships
- scalable querying
- security

Avoid:

- duplicated ownership data
- unclear relationships
- insecure access patterns

---

State Management Philosophy

Local State First

Prefer:

- React state
- component state
- server state

Avoid:

- unnecessary global state
- premature Zustand/Redux usage

---

Global State Rules

Global state should only exist for:

- theme
- auth UI state if necessary
- lightweight app-wide UI concerns

---

Styling Architecture

Tailwind CSS

Livario uses:

- utility-first styling
- reusable component patterns
- consistent spacing systems

---

UI Component Strategy

Use:

- shadcn/ui foundation
- reusable custom wrappers
- consistent variants

Avoid:

- duplicated styling
- inconsistent spacing
- one-off UI patterns

---

Mobile-First Strategy

Mobile is the primary platform.

All interfaces should:

- work perfectly on mobile first
- scale progressively upward
- remain touch-friendly

---

Responsive Layout Philosophy

Use:

- responsive grids
- adaptive layouts
- progressive enhancement

Avoid:

- desktop-first assumptions
- cramped mobile layouts

---

File Naming Conventions

Use:

- kebab-case for files
- PascalCase for React components
- camelCase for variables/functions

Examples:

property-card.tsx
navbar.tsx
use-auth.ts
format-price.ts

---

Component Organization Rules

Shared Components

Global reusable UI:

src/components/

---

Feature Components

Feature-specific UI:

src/features/properties/components/

---

Environment Variable Strategy

Environment variables belong in:

.env.local

Never expose:

- service role keys
- private secrets

---

Example Variables

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

---

Upload Architecture

Livario uses Supabase Storage.

---

Storage Structure

properties/
property-id/
image-1.jpg

---

Upload Rules

Images should:

- remain optimized
- remain organized
- support future transformations

---

Security Architecture

Security is mandatory.

---

Core Security Principles

Always validate:

- ownership
- authentication
- protected actions

Never trust:

- frontend-only validation
- client role assumptions

---

Row Level Security

All user-owned data must use:

- RLS policies
- authenticated ownership validation

---

Performance Strategy

Prioritize:

- Server Components
- optimized images
- minimized client bundles
- efficient queries
- caching

---

SEO Strategy

Pages should support:

- metadata
- semantic HTML
- server rendering
- optimized performance

Especially:

- homepage
- listings
- property detail pages

---

Scalability Philosophy

Architecture should support future:

- rent billing
- recurring payments
- subscriptions
- analytics
- admin dashboards
- notifications

without major rewrites.

---

Deployment Architecture

Deployment uses:

- GitHub
- Vercel
- Supabase

---

Deployment Workflow

Local Development
↓
Git Commit
↓
GitHub Push
↓
Vercel Deployment

---

Engineering Standards

All code should prioritize:

- readability
- maintainability
- scalability
- consistency

Avoid:

- unnecessary complexity
- duplicated logic
- oversized components
- unclear abstractions

---

Commit Philosophy

Commit frequently.

Examples:

- setup auth
- add navbar
- create property card
- implement favorites

Avoid massive unstructured commits.

---

Documentation Philosophy

Architecture decisions should remain documented.

Future developers should quickly understand:

- structure
- rendering strategy
- auth flow
- ownership patterns
- feature organization

---

Final Principle

Livario’s architecture should feel:

- intentional
- scalable
- modern
- stable
- understandable

The codebase should remain clean enough that:

- future developers
- AI tools
- future teams

can continue building without architectural confusion.
