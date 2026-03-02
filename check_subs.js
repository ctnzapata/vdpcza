import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = 'https://aczbvdoodomuyzubijwy.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('push_subscriptions').select('*');
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Subscriptions:', data);
    }
}

check();
