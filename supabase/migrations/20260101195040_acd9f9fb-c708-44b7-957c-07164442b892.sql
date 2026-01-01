-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can verify their OTP" ON public.email_otps;
DROP POLICY IF EXISTS "Anyone can update OTP status" ON public.email_otps;

-- Create more restrictive policies
-- Only edge functions (service role) can read OTPs for verification
-- Public users cannot read OTP records at all
CREATE POLICY "Only service role can read OTPs" 
ON public.email_otps 
FOR SELECT 
USING (false);

-- Only service role can update OTPs (mark as verified)
CREATE POLICY "Only service role can update OTPs" 
ON public.email_otps 
FOR UPDATE 
USING (false);

-- Keep insert policy for creating new OTPs
-- The insert is fine because users can only add new records, not read existing ones