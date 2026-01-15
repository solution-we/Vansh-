import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the requesting user is an admin or owner
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has admin or owner role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "owner"]);

    // Check if any admin/owner role exists
    const hasAdminOrOwnerRole = roleData && roleData.length > 0;

    if (!hasAdminOrOwnerRole) {
      return new Response(JSON.stringify({ error: "Unauthorized: Admin or Owner access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all users from auth.users using admin API
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });

    if (usersError) {
      throw usersError;
    }

    // Fetch all roles
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("*");

    const roleMap = new Map(
      roles?.map((r) => [r.user_id, { role: r.role, role_id: r.id }]) || []
    );

    // Fetch all profiles to get full user data
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("user_id, full_name, username, avatar_url, phone, country_code, gender, date_of_birth, profile_completed, created_at, updated_at");

    const profileMap = new Map(
      profiles?.map((p) => [p.user_id, { 
        full_name: p.full_name, 
        username: p.username,
        avatar_url: p.avatar_url,
        phone: p.phone,
        country_code: p.country_code,
        gender: p.gender,
        date_of_birth: p.date_of_birth,
        profile_completed: p.profile_completed,
        profile_created_at: p.created_at,
        profile_updated_at: p.updated_at
      }]) || []
    );

    // Combine user data with roles and profiles
    const usersWithRoles = users.map((u) => {
      const roleInfo = roleMap.get(u.id);
      const profileInfo = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email || "No email",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        phone: u.phone,
        role: roleInfo?.role || null,
        role_id: roleInfo?.role_id || null,
        user_metadata: u.user_metadata,
        profile: profileInfo || null,
      };
    });

    return new Response(JSON.stringify({ users: usersWithRoles }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
