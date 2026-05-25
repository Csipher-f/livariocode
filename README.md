Livario

Modern housing discovery and rent-tech infrastructure platform.

---

Overview

Livario is a modern housing platform focused on:

- premium property discovery
- landlord property management
- tenant-focused housing discovery
- mobile-first user experience
- future rent-tech infrastructure

The platform is being built in structured phases to ensure:

- clean architecture
- scalable systems
- stable authentication
- premium UX
- long-term maintainability

---

Product Vision

Livario aims to modernize the housing experience with:

- elegant UI
- scalable infrastructure
- modern engineering standards
- mobile-first architecture
- premium user experience

The product experience should feel closer to:

- Airbnb
- Apple
- Linear

than traditional classified marketplaces.

---

Tech Stack

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

Project Initialization

Livario was initialized manually using the official Next.js "create-next-app" workflow with:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router
- Turbopack
- src/ directory structure

This ensures:

- clean official framework setup
- predictable architecture
- compatibility with modern Next.js standards
- long-term maintainability

The foundational project setup is intentionally created before AI-assisted implementation begins.

---

Core Principles

Livario prioritizes:

- simplicity
- scalability
- maintainability
- performance
- premium UX
- mobile-first design

Avoid:

- overengineering
- duplicated logic
- inconsistent UI patterns
- unnecessary abstractions

---

Repository Structure

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

Documentation

Core project documentation lives inside:

docs/

Important documents include:

- AGENT.md
- ROADMAP.md
- ARCHITECTURE.md
- AUTHENTICATION.md
- DATABASE.md
- UI_GUIDELINES.md

These documents define:

- engineering standards
- architecture philosophy
- authentication architecture
- database architecture
- UI/UX direction
- roadmap priorities

All implementation decisions should align with them.

---

Local Development Setup

Clone the repository:

git clone <repository-url>

Enter the project directory:

cd livario

Install dependencies:

npm install

---

Environment Variables

Create:

.env.local

Add required variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Never commit secrets to GitHub.

---

Development

Run the development server:

npm run dev

Open:

http://localhost:3000

---

Build Commands

Development

npm run dev

Production Build

npm run build

Start Production Server

npm run start

Lint

npm run lint

---

Development Workflow

The foundational application setup is created manually using official Next.js tooling.

Core project documentation is then added before implementation begins.

AI-assisted development tools such as Codex are used primarily for:

- implementation
- architecture expansion
- feature development
- integration work
- refactoring

not for inventing the initial project structure blindly.

This workflow improves:

- architectural consistency
- maintainability
- predictability
- code quality

---

Architecture Philosophy

Livario uses:

- server-first rendering
- feature-oriented organization
- reusable component systems
- SSR-compatible authentication
- scalable database architecture

The application prioritizes:

- Server Components
- Server Actions
- minimal client-side state
- modular architecture

Detailed technical architecture is documented in:

docs/ARCHITECTURE.md

---

Authentication

Authentication is powered by Supabase Auth.

Features include:

- signup
- login
- logout
- password reset
- protected routes
- SSR session handling

Authentication standards are documented in:

docs/AUTHENTICATION.md

---

Database

The database architecture uses:

- PostgreSQL
- relational schema design
- Row Level Security
- ownership-based permissions

Database standards are documented in:

docs/DATABASE.md

---

UI & UX

Livario follows:

- mobile-first design
- premium UI principles
- reusable design systems
- consistent spacing/typography

UI standards are documented in:

docs/UI_GUIDELINES.md

---

Deployment

Deployment stack:

- GitHub
- Vercel
- Supabase

Production deployment standards are documented in:

docs/DEPLOYMENT.md

---

Engineering Workflow

Recommended workflow:

feature branch
↓
local development
↓
commit changes
↓
push to GitHub
↓
preview deployment

Commit frequently with clear commit messages.

---

Commit Message Examples

setup auth architecture
create property card component
implement listing filters
add landlord dashboard layout

---

Design Direction

Livario should feel:

- clean
- calm
- premium
- modern
- trustworthy

Inspired by:

- Apple
- Airbnb
- Linear
- Notion

---

Future Roadmap

Planned future systems include:

- recurring rent payments
- automated billing
- subscription infrastructure
- analytics
- admin dashboards
- advanced landlord tools

Full roadmap available in:

docs/ROADMAP.md

---

Important Engineering Rules

Always:

- prioritize simplicity
- use reusable components
- maintain mobile-first design
- follow architectural standards
- avoid duplicated logic

Never:

- overengineer
- bypass security rules
- create inconsistent UI patterns
- introduce unnecessary abstractions

---

Final Principle

Livario is being built as:

- a scalable startup platform
- a premium user experience
- a long-term rent-tech infrastructure product

The architecture should remain:

- clean
- understandable
- maintainable
- scalable

through every stage of growth.
