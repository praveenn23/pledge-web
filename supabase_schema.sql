-- =====================================================
-- Road Safety Pledge - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Create pledges table
CREATE TABLE IF NOT EXISTS public.pledges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT,
  name          TEXT NOT NULL,
  gender        TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
  dob           DATE,
  pincode       VARCHAR(6),
  state         TEXT NOT NULL,
  district      TEXT,
  email         TEXT,
  mobile        VARCHAR(10) NOT NULL,
  consent       BOOLEAN DEFAULT FALSE,
  otp_verified  BOOLEAN DEFAULT FALSE,
  pledge_taken  BOOLEAN DEFAULT FALSE,
  certificate_id TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anyone (public form submission)
CREATE POLICY "Allow public insert" ON public.pledges
  FOR INSERT WITH CHECK (true);

-- Policy: Allow reads via certificate_id (for certificate page)
CREATE POLICY "Allow read by certificate_id" ON public.pledges
  FOR SELECT USING (true);

-- Policy: Allow server-side updates (using service role key bypasses RLS)
-- Service role key in backend automatically bypasses RLS

-- Index for faster certificate lookups
CREATE INDEX IF NOT EXISTS idx_pledges_certificate_id ON public.pledges(certificate_id);
CREATE INDEX IF NOT EXISTS idx_pledges_mobile ON public.pledges(mobile);
CREATE INDEX IF NOT EXISTS idx_pledges_created_at ON public.pledges(created_at DESC);

-- View: Summary stats (optional, for admin)
CREATE OR REPLACE VIEW public.pledge_stats AS
SELECT
  COUNT(*) AS total_registrations,
  COUNT(*) FILTER (WHERE otp_verified = true) AS otp_verified_count,
  COUNT(*) FILTER (WHERE pledge_taken = true) AS pledges_taken,
  COUNT(DISTINCT state) AS states_covered,
  DATE(created_at) AS date
FROM public.pledges
GROUP BY DATE(created_at)
ORDER BY date DESC;
