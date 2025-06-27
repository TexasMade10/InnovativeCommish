-- Sample data for Commission Tracker
-- Run this in your Supabase SQL editor to populate with realistic data

-- Clear existing data
DELETE FROM statements;
DELETE FROM carriers;
DELETE FROM reps;
DELETE FROM companies;
DELETE FROM gpt_mappings;
DELETE FROM errors;

-- Insert sample carriers
INSERT INTO carriers (name, status, setup_date, first_statement_date, notes) VALUES
('Blue Cross Blue Shield', 'active', '2023-01-15', '2023-02-01', 'Primary health insurance carrier'),
('Aetna', 'active', '2023-01-20', '2023-02-15', 'Major health benefits provider'),
('UnitedHealth Group', 'active', '2023-02-01', '2023-03-01', 'Largest health insurer in US'),
('Cigna', 'active', '2023-02-10', '2023-03-15', 'Global health service company'),
('Humana', 'active', '2023-01-25', '2023-02-20', 'Medicare Advantage specialist'),
('Kaiser Permanente', 'pending', '2023-03-01', NULL, 'Integrated health system'),
('Anthem', 'active', '2023-02-05', '2023-03-10', 'Blue Cross Blue Shield licensee'),
('MetLife', 'flagged', '2023-01-30', '2023-02-25', 'Life and disability insurance');

-- Insert sample reps
INSERT INTO reps (name, email, commission_rate, total_earnings, total_lives) VALUES
('John Smith', 'john.smith@company.com', 0.15, 45000, 1200),
('Sarah Johnson', 'sarah.johnson@company.com', 0.12, 38000, 950),
('Mike Davis', 'mike.davis@company.com', 0.18, 52000, 1400),
('Lisa Wilson', 'lisa.wilson@company.com', 0.14, 42000, 1100),
('David Brown', 'david.brown@company.com', 0.16, 48000, 1300);

-- Insert sample companies
INSERT INTO companies (name, industry, employee_count, total_premium, status) VALUES
('TechCorp Solutions', 'Technology', 250, 125000, 'active'),
('Healthcare Partners LLC', 'Healthcare', 180, 89000, 'active'),
('Manufacturing Inc', 'Manufacturing', 320, 156000, 'active'),
('Retail Solutions', 'Retail', 150, 75000, 'pending'),
('Financial Services Group', 'Finance', 200, 110000, 'active');

-- Insert sample statements (last 6 months)
INSERT INTO statements (file_name, file_type, carrier, premium, commission, lives, month, confidence) VALUES
('BCBS_Commission_Jan2024.pdf', 'application/pdf', 'Blue Cross Blue Shield', 125000, 12500, 1250, 'January 2024', 0.95),
('Aetna_Commission_Feb2024.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Aetna', 89500, 8950, 895, 'February 2024', 0.92),
('UnitedHealth_Commission_Mar2024.pdf', 'application/pdf', 'UnitedHealth Group', 156750, 15675, 1567, 'March 2024', 0.88),
('Cigna_Commission_Apr2024.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Cigna', 98200, 9820, 982, 'April 2024', 0.94),
('Humana_Commission_May2024.pdf', 'application/pdf', 'Humana', 112300, 11230, 1123, 'May 2024', 0.91),
('Anthem_Commission_Jun2024.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Anthem', 134500, 13450, 1345, 'June 2024', 0.93),
('BCBS_Commission_Jul2024.pdf', 'application/pdf', 'Blue Cross Blue Shield', 118000, 11800, 1180, 'July 2024', 0.96),
('Aetna_Commission_Aug2024.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Aetna', 96700, 9670, 967, 'August 2024', 0.89),
('UnitedHealth_Commission_Sep2024.pdf', 'application/pdf', 'UnitedHealth Group', 142800, 14280, 1428, 'September 2024', 0.90),
('Cigna_Commission_Oct2024.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Cigna', 105600, 10560, 1056, 'October 2024', 0.92);

-- Insert sample GPT mappings
INSERT INTO gpt_mappings (carrier_name, field_mappings, confidence_threshold, training_data_count, last_updated) VALUES
('Blue Cross Blue Shield', '{"premium": "total_premium", "commission": "commission_amount", "lives": "member_count"}', 0.85, 150, NOW()),
('Aetna', '{"premium": "gross_premium", "commission": "commission_paid", "lives": "enrolled_lives"}', 0.88, 120, NOW()),
('UnitedHealth Group', '{"premium": "premium_amount", "commission": "commission_total", "lives": "covered_lives"}', 0.82, 200, NOW()),
('Cigna', '{"premium": "total_premium", "commission": "commission_amount", "lives": "member_count"}', 0.90, 180, NOW()),
('Humana', '{"premium": "premium_total", "commission": "commission_paid", "lives": "enrolled_members"}', 0.87, 95, NOW());

-- Insert sample errors
INSERT INTO errors (statement_id, error_type, error_message, severity, resolved, created_at) VALUES
(1, 'parsing_error', 'Unable to extract commission amount from PDF', 'medium', false, NOW()),
(3, 'data_anomaly', 'Commission rate unusually high (15.2%)', 'high', false, NOW()),
(5, 'missing_data', 'Lives count not found in statement', 'low', true, NOW()),
(7, 'format_error', 'Unexpected PDF structure', 'medium', false, NOW());

-- Update rep earnings based on statements
UPDATE reps SET 
  total_earnings = (
    SELECT COALESCE(SUM(commission), 0) 
    FROM statements 
    WHERE statements.carrier IN ('Blue Cross Blue Shield', 'Aetna', 'UnitedHealth Group')
  ),
  total_lives = (
    SELECT COALESCE(SUM(lives), 0) 
    FROM statements 
    WHERE statements.carrier IN ('Blue Cross Blue Shield', 'Aetna', 'UnitedHealth Group')
  )
WHERE name = 'John Smith';

UPDATE reps SET 
  total_earnings = (
    SELECT COALESCE(SUM(commission), 0) 
    FROM statements 
    WHERE statements.carrier IN ('Cigna', 'Humana')
  ),
  total_lives = (
    SELECT COALESCE(SUM(lives), 0) 
    FROM statements 
    WHERE statements.carrier IN ('Cigna', 'Humana')
  )
WHERE name = 'Sarah Johnson'; 