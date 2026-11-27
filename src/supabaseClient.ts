import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ddhpwqwgjlndmrqeojde.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iRGTpCnH_FzTZhx1e7AR-A_fmZhY11H';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
