import { createClient } from '@supabase/supabase-js';
import { Logger } from '../../shared/utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabaseService = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
    Logger.error('Missing Supabase credentials', {
        url: supabaseUrl ? 'present' : 'missing',
        key: supabaseKey ? 'present' : 'missing',

    });
    throw new Error('SUPABASE_URL and SUPABASE_PUBLISHABLE_DEFAULT_KEY are required in .env');
}

Logger.info('Initializing Supabase clients');

export const CreateSupabaseClient = (jwt: string) => {
    return createClient(supabaseUrl, supabaseKey!, {
        global: {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    });
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseService!);
export const supabase = createClient(supabaseUrl, supabaseKey!);

Logger.info('Supabase clients initialized');

