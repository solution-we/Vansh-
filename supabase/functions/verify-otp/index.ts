import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyOtpRequest {
  email: string;
  otp: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, password }: VerifyOtpRequest = await req.json();
    
    // Validate inputs
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!otp || !otp.match(/^\d{6}$/)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid OTP format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!password || password.length < 8) {
      return new Response(
        JSON.stringify({ success: false, error: "Password must be at least 8 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify OTP from database (server-side only)
    const now = new Date().toISOString();
    const { data: otpData, error: otpError } = await supabase
      .from('email_otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('verified', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      console.log(`OTP verification failed for ${email}: ${otpError?.message || 'No valid OTP found'}`);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired verification code" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark OTP as verified
    await supabase
      .from('email_otps')
      .update({ verified: true })
      .eq('id', otpData.id);

    // Create the user account using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since OTP verified
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already been registered')) {
        return new Response(
          JSON.stringify({ success: false, error: "An account with this email already exists" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      throw authError;
    }

    console.log(`User created successfully: ${email}`);

    // Generate a session for the new user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    // Return success - client will need to sign in
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Account created successfully",
        userId: authData.user?.id 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "An error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
