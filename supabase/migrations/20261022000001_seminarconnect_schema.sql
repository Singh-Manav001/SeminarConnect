-- ==============================================================================
-- SeminarConnect Database Migration
-- PostgreSQL / Supabase Schema Definition
-- Version: 2026-10-22
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('principal', 'candidate', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE delivery_format AS ENUM ('online', 'offline', 'hybrid');
CREATE TYPE booking_status AS ENUM (
  'pending', 
  'accepted', 
  'payment_pending', 
  'confirmed', 
  'rescheduled', 
  'completed', 
  'cancelled', 
  'rejected', 
  'disputed'
);
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INSTITUTIONS (Principals)
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  institution_type TEXT NOT NULL, -- 'School', 'College', 'University', etc.
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  website TEXT,
  verification_doc_url TEXT,
  verification_status verification_status DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CANDIDATE PROFILES (Seminar Speakers)
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  professional_title TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  highest_qualification TEXT NOT NULL,
  base_seminar_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- INR
  travel_radius_km INTEGER NOT NULL DEFAULT 50, -- km
  preferred_delivery_format delivery_format DEFAULT 'hybrid',
  address TEXT,
  city TEXT NOT NULL,
  district TEXT,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  bio_video_url TEXT,
  resume_url TEXT,
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  rating_avg NUMERIC(3, 2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SKILLS & CANDIDATE SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEMINAR OFFERINGS (Packages created by candidate)
CREATE TABLE IF NOT EXISTS seminar_offerings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  learning_outcomes TEXT[] NOT NULL,
  target_audience TEXT NOT NULL, -- 'High School (9-12)', 'Undergraduate', 'Postgraduate', 'Faculty'
  session_duration_minutes INTEGER NOT NULL DEFAULT 90,
  max_audience_size INTEGER NOT NULL DEFAULT 100,
  delivery_format delivery_format NOT NULL DEFAULT 'hybrid',
  base_price NUMERIC(10, 2) NOT NULL, -- INR
  travel_charge_per_km NUMERIC(6, 2) DEFAULT 0.00, -- INR/km
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUALIFICATIONS & CREDENTIALS
CREATE TABLE IF NOT EXISTS qualifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  degree_title TEXT NOT NULL,
  institution TEXT NOT NULL,
  year_completed INTEGER NOT NULL,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VERIFICATION DOCUMENTS
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'Government ID', 'Educational Degree', 'Institution Registration', 'Affiliation Certificate'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status verification_status DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SERVICE LOCATIONS
CREATE TABLE IF NOT EXISTS service_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  radius_km INTEGER NOT NULL DEFAULT 50,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AVAILABILITY SLOTS
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_times CHECK (end_time > start_time)
);

-- 11. SEMINAR REQUIREMENTS (Principal posted requests)
CREATE TABLE IF NOT EXISTS seminar_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  principal_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  target_date DATE NOT NULL,
  start_time TIME,
  duration_minutes INTEGER DEFAULT 90,
  delivery_format delivery_format NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  audience_size INTEGER NOT NULL,
  budget NUMERIC(10, 2) NOT NULL,
  preferred_language TEXT DEFAULT 'English',
  status TEXT DEFAULT 'open', -- 'open', 'assigned', 'closed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL, -- e.g. 'SC-2026-8941'
  offering_id UUID REFERENCES seminar_offerings(id) ON DELETE SET NULL,
  requirement_id UUID REFERENCES seminar_requirements(id) ON DELETE SET NULL,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE RESTRICT,
  principal_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  seminar_title TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  delivery_format delivery_format NOT NULL,
  venue_address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  audience_count INTEGER NOT NULL,
  base_fee NUMERIC(10, 2) NOT NULL,
  travel_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  platform_commission_rate NUMERIC(4, 2) NOT NULL DEFAULT 10.00, -- 10%
  platform_fee NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  candidate_payout_amount NUMERIC(10, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES profiles(id),
  reschedule_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index to prevent duplicate confirmed bookings on identical candidate date and start_time
CREATE UNIQUE INDEX IF NOT EXISTS idx_prevent_candidate_double_booking 
ON bookings (candidate_id, event_date, start_time) 
WHERE status IN ('confirmed', 'payment_pending');

-- 13. BOOKING STATUS HISTORY
CREATE TABLE IF NOT EXISTS booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_status booking_status,
  to_status booking_status NOT NULL,
  note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  principal_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  gateway_signature TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'pending',
  receipt_url TEXT,
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. REFUNDS
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  amount NUMERIC(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  gateway_refund_id TEXT,
  status TEXT DEFAULT 'processed',
  initiated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. PAYOUTS
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE RESTRICT,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  transfer_reference TEXT,
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  principal_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  notification_type TEXT NOT NULL DEFAULT 'booking', -- 'booking', 'payment', 'system', 'message'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  principal_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(principal_id, candidate_id)
);

-- 20. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  principal_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE RESTRICT,
  offering_id UUID REFERENCES seminar_offerings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. DISPUTES & REPORTS
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  raised_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  against_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
  resolution_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_candidate_location ON candidate_profiles(city, state, postal_code);
CREATE INDEX IF NOT EXISTS idx_candidate_coordinates ON candidate_profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_candidate_rating ON candidate_profiles(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_fee ON candidate_profiles(base_seminar_fee);
CREATE INDEX IF NOT EXISTS idx_offerings_category ON seminar_offerings(category_id);
CREATE INDEX IF NOT EXISTS idx_offerings_format ON seminar_offerings(delivery_format);
CREATE INDEX IF NOT EXISTS idx_bookings_candidate ON bookings(candidate_id, event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_principal ON bookings(principal_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminar_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view speaker profiles; users can update own profile
CREATE POLICY "Public profiles are readable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Candidate profiles: Publicly readable; candidates can manage own
CREATE POLICY "Candidate profiles readable by all" ON candidate_profiles FOR SELECT USING (true);
CREATE POLICY "Candidates can update own candidate profile" ON candidate_profiles FOR UPDATE USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Offerings: Publicly readable; candidate can manage own
CREATE POLICY "Offerings readable by all" ON seminar_offerings FOR SELECT USING (true);

-- Bookings: Only involved Principal, Candidate or Admin can read
CREATE POLICY "Bookings viewable by parties" ON bookings FOR SELECT USING (
  principal_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  candidate_id IN (SELECT id FROM candidate_profiles WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())) OR
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Verification Documents: Only profile owner or admin can read
CREATE POLICY "Private verification documents" ON verification_documents FOR SELECT USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
