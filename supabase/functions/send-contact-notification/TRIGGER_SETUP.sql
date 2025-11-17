-- Database Trigger Setup for Email Notifications
-- Run this in your Supabase SQL Editor after setting up the Edge Function

-- First, make sure you have the http extension enabled
CREATE EXTENSION IF NOT EXISTS http;

-- Create a function that calls the Edge Function
CREATE OR REPLACE FUNCTION notify_new_contact_message()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Get Supabase URL and service role key from settings
  -- You'll need to set these in your Supabase project settings
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- If settings are not available, use environment variables or hardcode (less secure)
  IF supabase_url IS NULL THEN
    -- Get from project settings - you'll need to replace these with your actual values
    -- Or set them as database settings
    supabase_url := 'YOUR_SUPABASE_URL'; -- Replace with your project URL
  END IF;
  
  IF service_role_key IS NULL THEN
    service_role_key := 'YOUR_SERVICE_ROLE_KEY'; -- Replace with your service role key
  END IF;

  -- Call the Edge Function
  PERFORM
    net.http_post(
      url := supabase_url || '/functions/v1/send-contact-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'subject', NEW.subject,
        'message', NEW.message,
        'created_at', NEW.created_at
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_contact_message_insert ON contact_messages;

-- Create trigger that fires on insert
CREATE TRIGGER on_contact_message_insert
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact_message();

-- Alternative: Simpler approach using pg_net extension (if available)
-- This is a newer approach that's easier to set up

-- First, enable the pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Then create a simpler trigger function
CREATE OR REPLACE FUNCTION notify_new_contact_message_simple()
RETURNS TRIGGER AS $$
BEGIN
  -- Use pg_net to make HTTP request
  -- Replace YOUR_SUPABASE_URL with your actual Supabase project URL
  -- Replace YOUR_SERVICE_ROLE_KEY with your service role key from Settings > API
  PERFORM
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/send-contact-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body := jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'subject', NEW.subject,
        'message', NEW.message,
        'created_at', NEW.created_at
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: You'll need to replace YOUR_SUPABASE_URL and YOUR_SERVICE_ROLE_KEY with actual values
-- Get these from: Settings > API in your Supabase dashboard

