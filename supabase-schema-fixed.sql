-- Commission Tracker Database Schema (Fixed Version)
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (WARNING: This will delete all data)
-- Uncomment the lines below if you want to start fresh
-- DROP TABLE IF EXISTS errors CASCADE;
-- DROP TABLE IF EXISTS gpt_mappings CASCADE;
-- DROP TABLE IF EXISTS reps CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;
-- DROP TABLE IF EXISTS carriers CASCADE;
-- DROP TABLE IF EXISTS statements CASCADE;

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
  status TEXT DEFAULT 'pending',
  setup_date DATE,
  first_statement_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to carriers table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'carriers_status_check'
  ) THEN
    ALTER TABLE carriers ADD CONSTRAINT carriers_status_check 
    CHECK (status IN ('active', 'pending', 'flagged'));
  END IF;
END $$;

-- Companies table - client companies from statements
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  group_number TEXT,
  plan_type TEXT,
  status TEXT DEFAULT 'active',
  total_commission DECIMAL(12,2) DEFAULT 0,
  total_lives INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to companies table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'companies_status_check'
  ) THEN
    ALTER TABLE companies ADD CONSTRAINT companies_status_check 
    CHECK (status IN ('active', 'inactive'));
  END IF;
END $$;

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
  severity TEXT DEFAULT 'medium',
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to errors table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'errors_severity_check'
  ) THEN
    ALTER TABLE errors ADD CONSTRAINT errors_severity_check 
    CHECK (severity IN ('low', 'medium', 'high'));
  END IF;
END $$;

-- Create indexes for better performance (ignore if they exist)
CREATE INDEX IF NOT EXISTS idx_statements_carrier ON statements(carrier);
CREATE INDEX IF NOT EXISTS idx_statements_month ON statements(month);
CREATE INDEX IF NOT EXISTS idx_statements_created_at ON statements(created_at);
CREATE INDEX IF NOT EXISTS idx_carriers_status ON carriers(status);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_errors_resolved ON errors(is_resolved);

-- Clear existing sample data and insert fresh data
DELETE FROM carriers WHERE name IN ('Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth');
DELETE FROM companies WHERE name IN ('Acme Corp', 'TechStart Inc', 'Global Industries');
DELETE FROM reps WHERE name IN ('John Smith', 'Sarah Johnson', 'Mike Davis');

-- Insert sample data for testing
INSERT INTO carriers (name, status, setup_date) VALUES
  ('Blue Cross Blue Shield', 'active', '2024-01-01'),
  ('Aetna', 'active', '2024-01-15'),
  ('Cigna', 'pending', NULL),
  ('UnitedHealth', 'flagged', '2024-02-01');

INSERT INTO companies (name, group_number, plan_type) VALUES
  ('Acme Corp', 'GRP001', 'PPO'),
  ('TechStart Inc', 'GRP002', 'HMO'),
  ('Global Industries', 'GRP003', 'EPO');

INSERT INTO reps (name, email, commission_rate) VALUES
  ('John Smith', 'john@example.com', 0.12),
  ('Sarah Johnson', 'sarah@example.com', 0.15),
  ('Mike Davis', 'mike@example.com', 0.10); 