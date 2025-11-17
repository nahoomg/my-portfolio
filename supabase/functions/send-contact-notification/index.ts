import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL")

serve(async (req) => {
  try {
    const { name, email, subject, message, created_at } = await req.json()

    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      throw new Error("Missing environment variables")
    }

    const resend = new Resend(RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>", // Change this to your verified domain
      to: [NOTIFICATION_EMAIL],
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">New Message from Contact Form</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Date:</strong> ${new Date(created_at).toLocaleString()}</p>
          </div>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #10b981;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            <em>Reply directly to this email to respond to ${email}</em>
          </p>
        </div>
      `,
      text: `
New Message from Contact Form

Name: ${name}
Email: ${email}
Subject: ${subject}
Date: ${new Date(created_at).toLocaleString()}

Message:
${message}

---
Reply directly to this email to respond to ${email}
      `,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" } 
      }
    )
  }
})

