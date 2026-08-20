import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkRPCs() {
  const response = await fetch(`${url}/rest/v1/?apikey=${serviceRoleKey}`);
  const swagger = await response.json();
  const paths = Object.keys(swagger.paths || {});
  const rpcs = paths.filter(p => p.startsWith('/rpc/'));
  console.log('Available RPCs:', rpcs);
}

checkRPCs().catch(console.error);
