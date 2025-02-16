
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    {
        auth: {
            persistSession: true, // ✅ Ensures session is persisted
            autoRefreshToken: true, // ✅ Automatically refreshes tokens
            detectSessionInUrl: true, // ✅ Detects session in URL (important for magic links)
            cookieOptions: {
                name: "sb:token",
                lifetime: 60 * 60 * 24 * 7, // 7 days
                sameSite: "Lax",
            },
        },
    }
);