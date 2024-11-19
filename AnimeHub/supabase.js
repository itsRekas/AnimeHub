import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://dqitfacrrwmasnzhifqy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPA_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)