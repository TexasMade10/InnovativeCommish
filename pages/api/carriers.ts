import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { data: carriers, error } = await supabase
        .from('carriers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ carriers });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch carriers' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 