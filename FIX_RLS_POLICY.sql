-- Comprehensive Fix for RLS Policy Error
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing policies on contact_messages
DROP POLICY IF EXISTS "Allow public inserts" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated reads" ON contact_messages;
DROP POLICY IF EXISTS "Enable insert for anon users" ON contact_messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON contact_messages;

-- Step 2: Create a policy that explicitly allows anonymous users to insert
-- This is the key fix - using 'anon' role specifically
CREATE POLICY "Enable insert for anon users" ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Step 3: Also allow authenticated users to insert (optional, for future use)
CREATE POLICY "Enable insert for authenticated users" ON contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 4: Allow authenticated users to read (so you can view messages in dashboard)
CREATE POLICY "Enable read for authenticated users" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'contact_messages';

