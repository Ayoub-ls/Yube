import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(url, serviceRoleKey);
  const { data, error } = await supabase.from('clients').select('*').limit(1);
  if (error) {
    console.error('Error fetching clients:', error);
  } else {
    console.log('Columns returned:', Object.keys(data[0] || {}));
  }
}

check();
