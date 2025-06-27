-- Commission Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (we'll disable it for now since no auth)
-- ALTER TABLE statements ENABLE ROW LEVEL SECURITY;

-- Statements table - stores uploaded commission statements
CREATE TABLE IF NOT EXISTS statements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  carrier TEXT NOT NULL,
  premium DECIMAL(12,2) NOT NULL,
  commission DECIMAL(12,2) NOT NULL,
  lives INTEGER NOT NULL,
  month TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  file_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carriers table - tracks carrier setup and status
CREATE TABLE IF NOT EXISTS carriers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('active', 'pending', 'flagged')) DEFAULT 'pending',
  setup_date DATE,
  first_statement_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table - client companies from statements
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  group_number TEXT,
  plan_type TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  total_commission DECIMAL(12,2) DEFAULT 0,
  total_lives INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reps table - sales representatives
CREATE TABLE IF NOT EXISTS reps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  commission_rate DECIMAL(5,4) DEFAULT 0.10, -- 10% default
  total_earnings DECIMAL(12,2) DEFAULT 0,
  total_lives INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GPT Mappings table - stores field mappings for carriers
CREATE TABLE IF NOT EXISTS gpt_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  carrier_id UUID REFERENCES carriers(id) ON DELETE CASCADE,
  source_field TEXT NOT NULL,
  target_field TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Errors table - tracks anomalies and issues
CREATE TABLE IF NOT EXISTS errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  statement_id UUID REFERENCES statements(id) ON DELETE CASCADE,
  error_type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_statements_carrier ON statements(carrier);
CREATE INDEX IF NOT EXISTS idx_statements_month ON statements(month);
CREATE INDEX IF NOT EXISTS idx_statements_created_at ON statements(created_at);
CREATE INDEX IF NOT EXISTS idx_carriers_status ON carriers(status);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_errors_resolved ON errors(is_resolved);

-- Insert some sample data for testing
INSERT INTO carriers (name, status, setup_date) VALUES
  ('Blue Cross Blue Shield', 'active', '2024-01-01'),
  ('Aetna', 'active', '2024-01-15'),
  ('Cigna', 'pending', NULL),
  ('UnitedHealth', 'flagged', '2024-02-01')
ON CONFLICT (name) DO NOTHING;

INSERT INTO companies (name, group_number, plan_type) VALUES
  ('Acme Corp', 'GRP001', 'PPO'),
  ('TechStart Inc', 'GRP002', 'HMO'),
  ('Global Industries', 'GRP003', 'EPO')
ON CONFLICT DO NOTHING;

INSERT INTO reps (name, email, commission_rate) VALUES
  ('John Smith', 'john@example.com', 0.12),
  ('Sarah Johnson', 'sarah@example.com', 0.15),
  ('Mike Davis', 'mike@example.com', 0.10)
ON CONFLICT DO NOTHING; 