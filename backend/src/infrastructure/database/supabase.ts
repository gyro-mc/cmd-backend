import { createClient } from '@supabase/supabase-js';
import { Logger } from '../../shared/utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    Logger.error('Missing Supabase credentials', {
        url: supabaseUrl ? 'present' : 'missing',
        key: supabaseKey ? 'present' : 'missing'
    });
    throw new Error('SUPABASE_URL and SUPABASE_PUBLISHABLE_DEFAULT_KEY are required in .env');
}

Logger.info('Initializing Supabase client');

export const supabase = createClient(supabaseUrl, supabaseKey);

Logger.success('Supabase client initialized');