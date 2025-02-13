'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: sessionData } = await supabase.auth.getSession();

            if (sessionData?.session) {
                router.replace('/dashboard'); // Redirect to dashboard
            }
        };

        // Listen for auth changes (important for magic link authentication)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                router.replace('/dashboard'); // Redirect once session is set
            }
        });

        checkAuth();

        return () => {
            authListener.subscription.unsubscribe(); // Cleanup listener
        };
    }, [router]);

    return <p>Redirecting...</p>;
}
