Livario API & Server Action Conventions

Overview

Livario uses a modern backend architecture centered around:

- Server Actions
- server-side data fetching
- Supabase integration
- minimal API surface area

The architecture prioritizes:

- simplicity
- security
- maintainability
- scalability
- consistency

Avoid unnecessary REST complexity unless truly required.

---

Backend Philosophy

Livario is primarily:

- server-first
- action-oriented
- database-driven

Prefer:

- Server Actions
- server-side mutations
- direct secure database interactions

Avoid:

- excessive API route creation
- duplicated backend logic
- unnecessary abstraction layers

---

Preferred Backend Architecture

Primary Pattern

Use:

- Server Actions for mutations
- Server Components for reads

Examples:

- create property
- update profile
- save favorite
- send inquiry

---

Secondary Pattern

Use Route Handlers ONLY when necessary.

Examples:

- webhooks
- third-party integrations
- external callbacks
- file processing endpoints

---

Folder Structure

Global Actions

src/actions/

Used for:

- shared server actions
- cross-feature operations

---

Feature Actions

src/features/properties/actions/

Preferred for:

- feature-specific operations
- localized business logic

---

Naming Conventions

Server Actions

Use clear verb-based names.

Examples:

createProperty
updateProperty
deleteProperty
saveFavorite
sendInquiry

Avoid:

- vague names
- abbreviated names
- generic action labels

---

Route Handlers

Use:

- kebab-case folders
- descriptive endpoint naming

Examples:

/api/webhooks/stripe
/api/uploads

---

Server Action Philosophy

Server Actions should:

- remain focused
- do one responsibility well
- validate input
- validate ownership
- return predictable responses

Avoid oversized action files.

---

Input Validation

Validation is mandatory.

Never trust:

- frontend validation
- client-side assumptions
- unvalidated payloads

---

Validation Strategy

Use:

- Zod schemas
- shared validation utilities
- centralized validation logic where appropriate

---

Validation Example Philosophy

Validate:

- required fields
- ownership
- types
- enum values
- upload constraints

before database operations occur.

---

Error Handling Philosophy

Errors should be:

- predictable
- structured
- user-friendly
- secure

Avoid:

- leaking sensitive information
- raw database errors
- inconsistent error formats

---

Error Response Structure

Prefer consistent response patterns.

Example philosophy:

success
message
data
error

---

Success Response Philosophy

Successful actions should:

- remain concise
- return only required data
- avoid oversized payloads

---

Database Access Rules

All database operations must:

- validate authentication
- validate ownership
- respect RLS policies

Never bypass security architecture.

---

Authentication Rules

Protected operations must:

- verify authenticated user
- validate ownership
- reject unauthorized access

Server-side validation is mandatory.

---

Authorization Philosophy

Authentication alone is NOT enough.

Always validate:

- ownership
- role permissions
- resource access

---

Query Philosophy

Prefer:

- efficient queries
- minimal selected fields
- pagination
- indexed lookups

Avoid:

- oversized payloads
- unnecessary joins
- loading excessive relational data

---

Pagination Standards

Large datasets should support:

- pagination
- incremental loading
- infinite scroll later

Avoid loading entire collections unnecessarily.

---

File Upload Conventions

Uploads should:

- validate file type
- validate file size
- remain authenticated
- use organized storage paths

---

Storage Path Standards

Example:

properties/{property-id}/image-1.jpg

Avoid random storage naming.

---

Security Standards

Never expose:

- service role keys
- sensitive database internals
- unauthorized records

Always:

- validate ownership
- sanitize inputs
- enforce permissions

---

Server Component Data Fetching

Prefer:

- server-side fetching
- async Server Components
- cached reads where appropriate

Avoid unnecessary client-side fetch duplication.

---

Caching Philosophy

Cache:

- public listings
- public property pages
- static metadata

Avoid caching:

- sensitive user data
- authenticated ownership operations

---

API Response Philosophy

Responses should feel:

- predictable
- lightweight
- consistent

Avoid:

- deeply nested structures
- inconsistent naming
- unnecessary metadata

---

Type Safety Standards

Use TypeScript everywhere.

Prefer:

- typed responses
- typed validation
- shared interfaces
- generated database types later

Avoid:

- any
- inconsistent return shapes
- untyped payloads

---

Logging Philosophy

Log:

- critical failures
- authentication issues
- unexpected server errors

Avoid:

- excessive console noise
- sensitive information logging

---

Rate Limiting Philosophy

Future sensitive endpoints should support:

- rate limiting
- abuse prevention
- spam protection

Especially:

- auth endpoints
- inquiry systems
- uploads

---

Reusability Philosophy

Extract reusable:

- validators
- query helpers
- auth utilities
- response handlers

Avoid duplicated backend logic.

---

API Versioning Philosophy

Do NOT prematurely version APIs.

Version only when:

- external/public APIs exist
- breaking changes become unavoidable

---

Third-Party Integration Rules

External integrations should:

- remain isolated
- use dedicated utilities
- avoid leaking implementation details

Examples:

- payment providers
- email providers
- analytics

---

Engineering Standards

Backend code should remain:

- readable
- secure
- predictable
- maintainable

Future developers should quickly understand:

- action purpose
- validation flow
- ownership logic
- response structure

---

Final Principle

Livario’s backend architecture should feel:

- simple
- modern
- scalable
- secure
- understandable

The system should remain easy to evolve as Livario expands into:

- rent-tech
- payments
- subscriptions
- analytics
- financial infrastructure
