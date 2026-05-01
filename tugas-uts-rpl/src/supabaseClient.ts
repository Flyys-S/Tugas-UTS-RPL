import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rzlofjmeyfgltdeleqti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bG9mam1leWZnbHRkZWxlcXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTM4NjAsImV4cCI6MjA5MzE4OTg2MH0.Odwr4vH9lANEP8tZm-oUYG5xUhDf2KyDdeAEuW_dSmA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
