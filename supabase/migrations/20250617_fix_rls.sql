-- Drop existing policies
drop policy if exists "Allow profile creation during signup" on profiles;
drop policy if exists "Users can view and update their own profile" on profiles;
drop policy if exists "Service role can manage all profiles" on profiles;

-- Enable RLS on profiles table
alter table profiles enable row level security;

-- Allow profile creation during signup with a more permissive window
create policy "Allow profile creation during signup"
  on profiles for insert
  with check (
    -- Allow if the ID matches the authenticated user
    auth.uid() = id
    OR
    -- Or if there's a valid signup session with more time allowance
    (
      auth.role() = 'anon'
      AND EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = profiles.id
        AND auth.users.created_at >= now() - interval '15 minutes'
        AND auth.users.email = profiles.email  -- Additional verification
      )
    )
  );

-- Allow users to read and update their own profile
create policy "Users can view and update their own profile"
  on profiles for select, update
  using (auth.uid() = id);

-- Allow the service role to manage all profiles (needed for Stripe integration)
create policy "Service role can manage all profiles"
  on profiles for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- Add a default policy to deny all other operations
create policy "Deny all by default"
  on profiles for all
  using (false);