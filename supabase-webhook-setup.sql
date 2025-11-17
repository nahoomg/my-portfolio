-- Supabase Webhook Setup for Zapier Notifications
-- Run this AFTER you've created your Zapier Zap and have the webhook URL

-- IMPORTANT: Replace 'YOUR_ZAPIER_WEBHOOK_URL' with your actual Zapier webhook URL
-- Your Zapier webhook URL will look like: https://hooks.zapier.com/hooks/catch/123456/abcdef/

-- First, make sure the http extension is enabled (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS http;

-- Create the webhook
-- Note: You can also create this through the Supabase UI at Database > Webhooks
-- But this SQL script does it programmatically

-- If webhook already exists, drop it first
DO $$
BEGIN
  -- Check if webhook exists and drop it
  -- Note: Supabase doesn't have a direct DROP WEBHOOK command,
  -- so you'll need to delete it manually from the UI if it exists
  NULL;
END $$;

-- The webhook needs to be created through the Supabase UI:
-- 1. Go to Database > Webhooks in your Supabase dashboard
-- 2. Click "Create a new webhook"
-- 3. Use the settings below

/*
WEBHOOK CONFIGURATION (to be done in Supabase UI):

Name: Contact Form Zapier Notification
Table: contact_messages
Events: INSERT (check this box)
Type: HTTP Request
Method: POST
URL: YOUR_ZAPIER_WEBHOOK_URL (paste your Zapier webhook URL here)

HTTP Headers:
Content-Type: application/json

HTTP Request Body (JSON):
{
  "name": "{{ $body.name }}",
  "email": "{{ $body.email }}",
  "subject": "{{ $body.subject }}",
  "message": "{{ $body.message }}",
  "created_at": "{{ $body.created_at }}"
}
*/

-- Alternative: If you want to test the webhook manually, you can use this function
CREATE OR REPLACE FUNCTION test_zapier_webhook(webhook_url TEXT)
RETURNS void AS $$
BEGIN
  PERFORM
    net.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'name', 'Test User',
        'email', 'test@example.com',
        'subject', 'Test Message',
        'message', 'This is a test message from Supabase',
        'created_at', NOW()::text
      )
    );
END;
$$ LANGUAGE plpgsql;

-- To test: SELECT test_zapier_webhook('YOUR_ZAPIER_WEBHOOK_URL');

