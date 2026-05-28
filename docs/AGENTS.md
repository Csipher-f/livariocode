<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

Livario Engineering & Product Handbook
Project Overview
Livario is a modern rent-tech and housing discovery platform starting in Nigeria.
The goal of Livario is to create a premium, trustworthy, mobile-first platform where users can:
discover properties
list properties
connect with landlords
manage housing interactions digitally
Livario is inspired by:
Airbnb’s usability
Apple’s minimalism
modern SaaS scalability
premium product thinking
The platform is being built in phases to avoid overengineering and maintain clean scalable architecture.

Product Vision
Livario aims to become the operating system for renting and housing in Africa.
The long-term vision includes:
housing discovery
digital rent payments
recurring billing
landlord management tools
tenant management systems
subscription-based rent infrastructure
automated recurring rent collection
financial integrations
property operations tools
However, the current focus is ONLY Phase 1.

Phase Roadmap
Phase 1 — Housing Discovery Platform
Current phase.
Core features:
authentication
user profiles
landlord profiles
property listings
property images
property browsing
property search
filtering
property detail pages
favorites/saved listings
inquiries/contact system
responsive mobile-first UI
landlord dashboard
property upload flow
DO NOT implement:
recurring payments
subscriptions
rent automation
financial systems
escrow systems
advanced AI features
Keep Phase 1 lean and production-ready.

Phase 2 — Rent-Tech Infrastructure
Future phase.
Will include:
recurring rent billing
card registration
automated payments
tenant billing management
landlord payout systems
subscription logic
financial dashboards
payment reminders
payment history
monetization systems
Phase 2 architecture should be considered lightly but NOT implemented now.

Core Technology Stack
Frontend
Next.js 16 App Router
React 19
TypeScript
Tailwind CSS
shadcn/ui
Backend
Supabase
Authentication
PostgreSQL Database
Storage
Row Level Security
Infrastructure
GitHub
Vercel

Engineering Philosophy
Livario must maintain:
simplicity
scalability
maintainability
readability
production-grade quality
Avoid:
unnecessary abstractions
enterprise complexity too early
premature optimization
bloated dependencies
duplicated logic
overly clever code
The codebase should feel:
clean
modern
intentional
premium
scalable

Architecture Philosophy
Use feature-driven architecture where appropriate.
Avoid dumping all logic into:
massive utility folders
giant global state systems
deeply nested abstractions
Keep related functionality grouped together.
Prefer:
composable architecture
reusable UI
server-first patterns
clear folder ownership

Next.js Standards
Use:
App Router only
Server Components by default
Client Components only when necessary
Server Actions where appropriate
Route Handlers for APIs when needed
Avoid outdated Pages Router patterns.
Use modern Next.js 16 conventions only.

Supabase Standards
Authentication must use:
modern SSR-compatible patterns
secure session handling
middleware protection
reusable auth utilities
Avoid:
duplicated auth logic
scattered auth implementations
insecure client-side-only auth patterns
outdated Supabase examples
Database structure should prioritize:
scalability
clean relationships
row-level security
future extensibility

UI/UX Philosophy
Livario should feel premium.
Design inspiration:
Apple
Airbnb
Linear
Notion
UI principles:
minimalist
elegant
highly readable
mobile-first
smooth interactions
modern spacing
soft rounded corners
excellent typography
subtle animations
Avoid:
clutter
heavy gradients everywhere
excessive colors
inconsistent spacing
dashboard chaos

Design System Rules
All UI should use reusable components.
Create reusable:
buttons
inputs
modals
cards
dropdowns
skeleton loaders
empty states
dialogs
navigation components
Maintain consistent:
spacing
typography
sizing
shadows
border radius

Mobile-First Standards
Mobile experience is priority.
Every page and feature must:
work beautifully on mobile first
scale upward to desktop
maintain touch-friendly spacing
optimize navigation for mobile users
Use:
bottom navigation where appropriate
responsive layouts
adaptive grids

State Management Philosophy
Keep state management simple.
Prefer:
local state first
server state where possible
URL state when appropriate
Avoid introducing large global state libraries too early.
Only introduce advanced state management if clearly necessary.

Folder Structure Philosophy
Livario uses the modern Next.js "src/" directory structure.

All application source code should live inside:

src/

Recommended structure:

src/
├── app/
├── components/
├── features/
├── lib/
├── hooks/
├── types/
├── styles/
├── supabase/
├── actions/
├── constants/

Structure should remain:

- clean
- scalable
- predictable
- feature-oriented

Features should encapsulate related functionality where appropriate.

Avoid:

- dumping all logic into global folders
- unclear ownership boundaries
- deeply nested abstractions
- duplicated utilities

Root-level directories should primarily contain:

- configuration files
- environment files
- documentation
- tooling configuration
- static assets

Examples:

/docs
/public
/package.json
/tsconfig.json
/next.config.ts
Authentication Philosophy
Authentication architecture must:
scale cleanly
support tenant and landlord capabilities on the same user
avoid hydration issues
support protected routes
support persistent sessions
separate client/server responsibilities properly
Auth should feel invisible and reliable.

Role Architecture
Profiles must use dual-role capability flags:
is_tenant defaults to true
is_landlord defaults to false
active_role tracks tenant or landlord mode
A user can activate both tenant and landlord roles simultaneously.
Do not use one locked role field for tenant vs landlord.
After signup, users go to onboarding and choose:
"Continue as Tenant" or "Continue as Landlord"
Show the note:
"You can switch this later in Settings"

Performance Standards
Prioritize:
fast page loads
optimized images
lazy loading where appropriate
minimal client-side JavaScript
excellent Lighthouse scores
Avoid unnecessary rerenders.

Accessibility Standards
Maintain:
semantic HTML
keyboard accessibility
readable contrast
proper labels
responsive typography
Accessibility is not optional.

Security Standards
Never expose:
service role keys
sensitive environment variables
insecure API patterns
Always validate:
user ownership
uploads
permissions
Use Row Level Security properly.

Development Workflow
Preferred workflow:
architecture first
foundation setup
authentication
database
design system
core features
optimization
deployment polish
Do not build random features out of order.

Git Workflow
Commit frequently.
Use clean commit messages:
feat:
fix:
refactor:
chore:
ui:
Avoid massive untracked changes.

Coding Standards
Use:
strict TypeScript
descriptive naming
reusable abstractions only when justified
readable code over clever code
Code should feel understandable to future engineers.

Naming Conventions
Use:
clear file names
consistent component naming
feature-based organization
predictable folder structures
Avoid vague names.

Future Scaling Philosophy
Livario is intended to scale.
Architecture decisions should support:
larger teams
future mobile apps
payment systems
analytics
admin systems
infrastructure expansion
But scaling preparation should NOT create unnecessary complexity today.

Final Principle
Build Livario like a premium startup product from Day 1.
Every decision should prioritize:
clarity
quality
scalability
maintainability
user experience
The codebase should feel intentional, modern, and production-ready.

## TypeScript Rules
Always preserve "ignoreDeprecations": "5.0" in tsconfig.json. 
This must never be removed under any circumstances.
