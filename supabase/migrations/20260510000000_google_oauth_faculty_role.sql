-- Google OAuth sign-ins with @ustp.edu.ph emails must be provisioned as
-- `faculty` (not the generic `user` role) so they can access /faculty.
--
-- This migration is IDEMPOTENT and SELF-HEALING:
--   0. Make sure `public.user_profiles` exists (previous migrations may not
--      have been applied to this project yet).
--   1. Patch the `handle_new_user` trigger so new auth.users rows created by
--      Google OAuth with a USTP email get `role = 'faculty'` on first login.
--   2. Backfill: promote any existing user_profiles rows that were created
--      under the old trigger (role='user') but belong to Google OAuth USTP
--      accounts, so prior sign-ins are corrected without requiring re-login.

-- 0. Defensive: ensure the user_profiles table exists -----------------------
-- This mirrors the shape defined in 20260306120000_create_user_profiles.sql
-- so the trigger function below can safely write to it even when that earlier
-- migration was never applied to the target database.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  employee_id TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'faculty', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraints / indexes (guarded so re-runs don't fail).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_email_key'
  ) THEN
    BEGIN
      ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_email_key UNIQUE (email);
    EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL;
    END;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_employee_id_key'
  ) THEN
    BEGIN
      ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_employee_id_key UNIQUE (employee_id);
    EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL;
    END;
  END IF;
END $$;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_profiles_email  ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role   ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

-- 1. Replace the trigger function ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_provider  TEXT;
  v_email     TEXT;
  v_role      TEXT;
  v_full_name TEXT;
BEGIN
  v_email    := COALESCE(NEW.email, '');
  v_provider := COALESCE(NEW.raw_app_meta_data->>'provider', '');
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.email
  );

  -- Decide role:
  --   a. explicit role in user_metadata always wins (admin-created accounts)
  --   b. Google OAuth + @ustp.edu.ph  -> faculty
  --   c. otherwise                    -> user
  IF NEW.raw_user_meta_data ? 'role' AND NEW.raw_user_meta_data->>'role' <> '' THEN
    v_role := NEW.raw_user_meta_data->>'role';
  ELSIF v_provider = 'google' AND lower(v_email) LIKE '%@ustp.edu.ph' THEN
    v_role := 'faculty';
  ELSE
    v_role := 'user';
  END IF;

  INSERT INTO public.user_profiles (id, full_name, email, role)
  VALUES (NEW.id, v_full_name, NEW.email, v_role)
  ON CONFLICT (id) DO UPDATE
    SET role = CASE
      -- Auto-upgrade existing Google USTP accounts that were previously
      -- created as plain 'user' (covers the case where the trigger fires
      -- twice or a stale profile exists).
      WHEN public.user_profiles.role = 'user'
           AND v_role = 'faculty'
        THEN 'faculty'
      ELSE public.user_profiles.role
    END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger itself is unchanged; re-bind defensively.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. Backfill existing Google OAuth USTP users ------------------------------
-- Also covers users who signed in before user_profiles existed: we INSERT
-- a faculty profile for them, then UPDATE any stale 'user' rows to 'faculty'.
DO $$
BEGIN
  IF to_regclass('public.user_profiles') IS NULL THEN
    RAISE NOTICE 'public.user_profiles does not exist — skipping backfill.';
    RETURN;
  END IF;

  -- Insert missing profiles for Google USTP users.
  INSERT INTO public.user_profiles (id, full_name, email, role, status)
  SELECT
    au.id,
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name',
      au.email
    ),
    au.email,
    'faculty',
    'active'
  FROM auth.users au
  WHERE COALESCE(au.raw_app_meta_data->>'provider', '') = 'google'
    AND lower(COALESCE(au.email, '')) LIKE '%@ustp.edu.ph'
  ON CONFLICT (id) DO NOTHING;

  -- Promote any existing Google USTP profiles still stuck on 'user'.
  UPDATE public.user_profiles up
  SET    role = 'faculty'
  FROM   auth.users au
  WHERE  up.id = au.id
    AND  up.role = 'user'
    AND  COALESCE(au.raw_app_meta_data->>'provider', '') = 'google'
    AND  lower(COALESCE(au.email, '')) LIKE '%@ustp.edu.ph';
END $$;
