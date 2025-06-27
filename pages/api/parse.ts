import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ParsedData {
  carrier: string;
  premium: number;
  commission: number;
  lives: number;
  month: string;
  fileName: string;
  fileType: string;
  confidence: number;
}

interface ApiResponse {
  success: boolean;
  data?: ParsedData;
  error?: string;
}

// Mock data generator based on filename
const generateMockData = (fileName: string, fileType: string): ParsedData => {
  const fileNameLower = fileName.toLowerCase();
  
  // Extract carrier from filename
  let carrier = 'Unknown Carrier';
  if (fileNameLower.includes('bcbs') || fileNameLower.includes('blue cross')) {
    carrier = 'Blue Cross Blue Shield';
  } else if (fileNameLower.includes('aetna')) {
    carrier = 'Aetna';
  } else if (fileNameLower.includes('unitedhealth') || fileNameLower.includes('united health')) {
    carrier = 'UnitedHealth Group';
  } else if (fileNameLower.includes('cigna')) {
    carrier = 'Cigna';
  } else if (fileNameLower.includes('humana')) {
    carrier = 'Humana';
  } else if (fileNameLower.includes('kaiser')) {
    carrier = 'Kaiser Permanente';
  } else if (fileNameLower.includes('anthem')) {
    carrier = 'Anthem';
  } else if (fileNameLower.includes('metlife')) {
    carrier = 'MetLife';
  } else if (fileNameLower.includes('prudential')) {
    carrier = 'Prudential';
  } else if (fileNameLower.includes('guardian')) {
    carrier = 'Guardian';
  }

  // Extract month from filename
  let month = 'January 2024';
  if (fileNameLower.includes('jan')) {
    month = 'January 2024';
  } else if (fileNameLower.includes('feb')) {
    month = 'February 2024';
  } else if (fileNameLower.includes('mar')) {
    month = 'March 2024';
  } else if (fileNameLower.includes('apr')) {
    month = 'April 2024';
  } else if (fileNameLower.includes('may')) {
    month = 'May 2024';
  } else if (fileNameLower.includes('jun')) {
    month = 'June 2024';
  } else if (fileNameLower.includes('jul')) {
    month = 'July 2024';
  } else if (fileNameLower.includes('aug')) {
    month = 'August 2024';
  } else if (fileNameLower.includes('sep')) {
    month = 'September 2024';
  } else if (fileNameLower.includes('oct')) {
    month = 'October 2024';
  } else if (fileNameLower.includes('nov')) {
    month = 'November 2024';
  } else if (fileNameLower.includes('dec')) {
    month = 'December 2024';
  }

  // Generate realistic commission data
  const basePremium = Math.floor(Math.random() * 200000) + 50000; // $50k - $250k
  const commissionRate = Math.random() * 0.15 + 0.05; // 5% - 20%
  const commission = Math.round(basePremium * commissionRate);
  const lives = Math.floor(basePremium / 100); // Rough estimate: $100 per life
  const confidence = Math.random() * 0.15 + 0.85; // 85% - 100%

  return {
    carrier,
    premium: basePremium,
    commission,
    lives,
    month,
    fileName,
    fileType,
    confidence
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fileContent, fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: fileName, fileType' 
      });
    }

    // Generate mock parsed data
    const parsedData = generateMockData(fileName, fileType);

    // Save to Supabase
    try {
      const { data: statementData, error: statementError } = await supabase
        .from('statements')
        .insert([
          {
            file_name: parsedData.fileName,
            file_type: parsedData.fileType,
            carrier: parsedData.carrier,
            premium: parsedData.premium,
            commission: parsedData.commission,
            lives: parsedData.lives,
            month: parsedData.month,
            confidence: parsedData.confidence
          }
        ])
        .select();

      if (statementError) {
        console.error('Error saving statement:', statementError);
      }

      // Upsert carrier
      const { error: carrierError } = await supabase
        .from('carriers')
        .upsert([
          {
            name: parsedData.carrier,
            status: 'active',
            setup_date: new Date().toISOString(),
            first_statement_date: new Date().toISOString()
          }
        ], {
          onConflict: 'name'
        });

      if (carrierError) {
        console.error('Error upserting carrier:', carrierError);
      }

    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with mock data even if DB fails
    }

    return res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Parse API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
} 