import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { data: reps, error } = await supabase
        .from('reps')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ reps });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch reps' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 