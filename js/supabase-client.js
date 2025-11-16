// Supabase Client Configuration for Mensthetic
import { createClient } from '@supabase/supabase-js';

// Environment variables should be injected at build time
const supabaseUrl = window.ENV?.SUPABASE_URL || 'https://sjswcfbihowvtrzxvdxy.supabase.co';
const supabaseKey = window.ENV?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqc3djZmJpaG93dnRyenh2ZHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MDQ0ODEsImV4cCI6MjA0Njk4MDQ4MX0.Mm49B6g6IaMPLl1-aOi97ey5OgdaZDN5h0IVpfKQVLI';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: false, // We don't need user sessions for analytics
        detectSessionInUrl: false
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// Test connection
supabase.from('user_sessions').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            // Connection failed - handle silently in production
        } else {
            // Connection successful
        }
    });