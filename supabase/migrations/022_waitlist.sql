-- Create waitlist_role enum
CREATE TYPE waitlist_role AS ENUM ('tenant', 'landlord');

-- Create waitlist_entries table
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  role waitlist_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one entry per email per role
CREATE UNIQUE INDEX waitlist_entries_email_role_idx ON waitlist_entries (email, role);

-- Index for admin queries
CREATE INDEX waitlist_entries_role_idx ON waitlist_entries (role);
CREATE INDEX waitlist_entries_created_at_idx ON waitlist_entries (created_at DESC);

-- RLS
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Public can insert (no auth required — frictionless signup)
CREATE POLICY "Public can join waitlist"
  ON waitlist_entries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read waitlist entries
CREATE POLICY "Admins can read waitlist"
  ON waitlist_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Grant insert to anon so unauthenticated users can join
GRANT INSERT ON waitlist_entries TO anon;
GRANT SELECT ON waitlist_entries TO authenticated;

SELECT * FROM waitlist_entries LIMIT 5;

GRANT INSERT ON waitlist_entries TO anon;
GRANT INSERT ON waitlist_entries TO authenticated;
GRANT SELECT ON waitlist_entries TO authenticated;
GRANT SELECT ON waitlist_entries TO anon;

CREATE POLICY "Public can read waitlist count"
  ON waitlist_entries FOR SELECT
  TO anon
  USING (true);