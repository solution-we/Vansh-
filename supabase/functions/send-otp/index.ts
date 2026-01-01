import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OtpEmailRequest {
  email: string;
  otp: string;
}

// Rate limit: max 3 OTPs per email per hour
const MAX_OTPS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp }: OtpEmailRequest = await req.json();
    
    // Validate email format
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.log(`Invalid email format: ${email}`);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate OTP format (6 digits)
    if (!otp || !otp.match(/^\d{6}$/)) {
      console.log(`Invalid OTP format`);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid OTP format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client for rate limiting check
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit: count OTPs sent to this email in the last hour
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabase
      .from('email_otps')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error("Error checking rate limit:", countError);
      // Continue anyway - don't block legitimate users due to DB error
    } else if (count !== null && count >= MAX_OTPS_PER_HOUR) {
      console.log(`Rate limit exceeded for email: ${email}, count: ${count}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Too many verification attempts. Please try again later." 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending OTP email to: ${email}`);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Vanshé <onboarding@resend.dev>",
        to: [email],
        subject: "Your Vanshé Verification Code",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="width: 100%; max-width: 400px; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e5e5;">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0 0 30px; font-size: 28px; font-weight: 500; font-family: Georgia, serif; color: #0a0a0a; letter-spacing: -0.5px;">
                          Vanshé
                        </h1>
                        <h2 style="margin: 0 0 10px; font-size: 18px; font-weight: 500; color: #0a0a0a;">
                          Verify Your Email
                        </h2>
                        <p style="margin: 0 0 30px; font-size: 14px; color: #737373; line-height: 1.5;">
                          Enter this code to complete your registration
                        </p>
                        <div style="background-color: #fafafa; border: 1px solid #e5e5e5; padding: 20px; margin: 0 0 30px;">
                          <span style="font-size: 32px; font-weight: 600; letter-spacing: 8px; font-family: 'SF Mono', Monaco, 'Courier New', monospace; color: #0a0a0a;">
                            ${otp}
                          </span>
                        </div>
                        <p style="margin: 0 0 10px; font-size: 12px; color: #a3a3a3;">
                          This code expires in 10 minutes
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #a3a3a3;">
                          If you didn't request this code, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; border-top: 1px solid #e5e5e5; text-align: center;">
                        <p style="margin: 0; font-size: 11px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 1px;">
                          © Vanshé Fashion
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    const data = await emailResponse.json();
    console.log("OTP email response:", data);

    if (!emailResponse.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
