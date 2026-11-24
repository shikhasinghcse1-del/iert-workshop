-- FlowVault Production Supabase Schema
-- WARNING: Contains intentionally misconfigured Row Level Security for educational security audit lab

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  credits INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Orders Table (VULNERABILITY: RLS is disabled)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  item TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS INTENTIONALLY DISABLED
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- 3. Notes Table (VULNERABILITY: RLS enabled with over-permissive USING (true) policy)
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Broken policy: Allows ANY authenticated or anonymous user to query ALL notes
CREATE POLICY "allow_all" ON public.notes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Insecure View without security_invoker = true (PostgreSQL CVE-2025-48757 pattern)
-- Bypasses underlying table security when queried by lower-privileged roles
CREATE OR REPLACE VIEW public.public_order_summary AS
  SELECT id, user_id, user_email, item, amount, status, created_at
  FROM public.orders;

-- 5. Seed Test Data (For Supabase Cloud / Self-hosted instance)
-- Test User A: usera@example.com
-- Test User B: userb@example.com
-- Admin User: admin@example.com
