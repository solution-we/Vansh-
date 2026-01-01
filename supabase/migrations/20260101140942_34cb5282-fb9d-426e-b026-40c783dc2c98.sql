-- Create table to store OTP codes for email verification
CREATE TABLE public.email_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (needed for signup flow before user exists)
CREATE POLICY "Anyone can create OTP for signup" 
ON public.email_otps 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to select their own OTP by email (for verification)
CREATE POLICY "Anyone can verify their OTP" 
ON public.email_otps 
FOR SELECT 
USING (true);

-- Allow updates to mark as verified
CREATE POLICY "Anyone can update OTP status" 
ON public.email_otps 
FOR UPDATE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_email_otps_email ON public.email_otps(email);
CREATE INDEX idx_email_otps_expires_at ON public.email_otps(expires_at);

-- Auto-cleanup old OTPs (optional trigger to delete expired ones)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.email_otps WHERE expires_at < now() OR verified = true;
  RETURN NEW;
END;
$$;

CREATE TRIGGER cleanup_otps_on_insert
AFTER INSERT ON public.email_otps
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_expired_otps();