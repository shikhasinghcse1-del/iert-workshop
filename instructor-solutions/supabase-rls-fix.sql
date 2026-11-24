-- ==============================================================================
-- Hardened Supabase Schema & Row Level Security Remediation
-- ==============================================================================

-- 1. Enforce Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 2. Drop insecure / over-permissive policies
DROP POLICY IF EXISTS "allow_all" ON public.notes;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- 3. Strict Profile Policies
CREATE POLICY "Users can view own profile only"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile only (restricted columns)"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- Prevents role escalation
  );

-- 4. Strict Orders Policies
CREATE POLICY "Users can view own orders only"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users cannot directly insert or modify orders"
  ON public.orders
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 5. Strict Notes Policies
CREATE POLICY "Users can manage own notes only"
  ON public.notes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Remediate Insecure View (PostgreSQL CVE-2025-48757 Fix)
-- Must include WITH (security_invoker = true) so that query caller permissions and RLS are enforced
DROP VIEW IF EXISTS public.public_order_summary;

CREATE VIEW public.public_order_summary
  WITH (security_invoker = true) AS
  SELECT id, user_id, user_email, item, amount, status, created_at
  FROM public.orders;
