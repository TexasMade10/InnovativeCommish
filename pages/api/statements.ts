import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { data: statements, error } = await supabase
        .from('statements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ statements });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch statements' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 