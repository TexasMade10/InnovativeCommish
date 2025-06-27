import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Statement {
  id: string;
  file_name: string;
  file_type: string;
  carrier: string;
  premium: number;
  commission: number;
  lives: number;
  month: string;
  confidence: number;
  created_at: string;
  file_content?: string;
}

export interface Carrier {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'flagged';
  setup_date?: string;
  first_statement_date?: string;
  notes?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  group_number?: string;
  plan_type?: string;
  status: 'active' | 'inactive';
  total_commission: number;
  total_lives: number;
  created_at: string;
}

export interface Rep {
  id: string;
  name: string;
  email?: string;
  commission_rate: number;
  total_earnings: number;
  total_lives: number;
  created_at: string;
} 