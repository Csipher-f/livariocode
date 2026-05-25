Livario Deployment Standards

Overview

Livario uses a modern deployment workflow built around:

- GitHub
- Vercel
- Supabase

The deployment architecture prioritizes:

- simplicity
- reliability
- scalability
- preview deployments
- production stability

---

Deployment Stack

Repository Hosting

- GitHub

Frontend Deployment

- Vercel

Backend Infrastructure

- Supabase

---

Deployment Philosophy

Livario should support:

- fast deployments
- preview environments
- safe production releases
- scalable infrastructure
- minimal operational complexity

Avoid:

- manual deployments
- unmanaged environments
- inconsistent configuration

---

Deployment Workflow

Local Development
↓
Git Commit
↓
GitHub Push
↓
Vercel Preview Deployment
↓
Production Deployment

---

Branch Strategy

Main Branch

main

Production-ready branch only.

---

Feature Branches

Use feature branches for active development.

Examples:

feature/auth
feature/property-listings
feature/dashboard

---

Git Workflow

Recommended Process

create feature branch
↓
develop locally
↓
test changes
↓
commit changes
↓
push to GitHub
↓
review preview deployment
↓
merge into main

---

Commit Philosophy

Commit frequently with clear messages.

Examples:

setup auth middleware
create property card
implement listing filters
add responsive navbar

Avoid:

- massive commits
- vague commit names
- unrelated grouped changes

---

Environment Variables

Environment variables should remain secure and environment-specific.

---

Local Environment

Use:

.env.local

---

Required Variables

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

---

Secrets Rules

Never commit:

- API secrets
- service role keys
- production credentials

Never expose sensitive values publicly.

---

Vercel Environment Variables

Environment variables must also be configured inside:

- Vercel Project Settings

---

Environment Separation

Use separate environments for:

- local development
- preview deployments
- production

This reduces deployment risk.

---

Supabase Deployment Philosophy

Supabase acts as:

- database
- authentication provider
- storage provider

Production data integrity is critical.

---

Database Migration Philosophy

Database schema changes should:

- remain versioned
- remain documented
- remain reversible where possible

Avoid manually editing production schemas blindly.

---

Migration Standards

Use:

- structured migrations
- consistent schema naming
- predictable ownership rules

---

Row Level Security

RLS policies must exist before production deployment.

Never deploy user-owned tables without:

- ownership validation
- access control
- protected queries

---

Preview Deployments

Vercel preview deployments should be used for:

- feature testing
- UI review
- responsive testing
- authentication verification

Preview deployments help reduce production issues.

---

Production Deployment Rules

Before production deployment verify:

- authentication works
- environment variables exist
- database migrations are correct
- RLS policies are active
- mobile layouts function correctly

---

Build Validation

Always ensure:

npm run build

passes before production deployment.

---

Lint Validation

Always ensure:

npm run lint

passes before deployment.

---

Performance Standards

Production deployments should prioritize:

- optimized images
- minimized client bundles
- server-first rendering
- efficient queries

---

Monitoring Philosophy

Future monitoring should include:

- deployment failures
- server errors
- authentication issues
- performance tracking

---

Rollback Philosophy

Deployments should remain easy to rollback.

Git history should remain:

- clean
- readable
- structured

---

CDN & Asset Philosophy

Static assets should:

- remain optimized
- remain compressed
- load efficiently on mobile networks

---

Mobile Performance Standards

Livario is mobile-first.

Production deployments must prioritize:

- responsive layouts
- fast load times
- touch usability
- network efficiency

especially for lower-bandwidth environments.

---

Security Standards

Before deployment verify:

- secrets remain protected
- RLS policies exist
- unauthorized access is blocked
- middleware protection works

---

Authentication Deployment Rules

Authentication must be tested in:

- local development
- preview deployments
- production

Verify:

- login
- signup
- logout
- session persistence
- route protection

before production release.

---

Storage Deployment Standards

Uploads should:

- remain authenticated
- remain organized
- use structured storage paths

Example:

properties/{property-id}/image-1.jpg

---

Future Scaling Philosophy

Deployment architecture should support future:

- recurring billing
- payment systems
- subscriptions
- analytics
- notifications
- admin systems

without major infrastructure rewrites.

---

Engineering Responsibility

Every deployment should prioritize:

- stability
- readability
- predictability
- user experience

Avoid:

- rushed deployments
- undocumented changes
- untested production releases

---

Final Principle

Livario deployments should feel:

- stable
- modern
- predictable
- scalable
- production-ready

The deployment process should remain simple enough that:

- future developers
- AI tools
- future engineering teams

can confidently ship features without deployment chaos.
