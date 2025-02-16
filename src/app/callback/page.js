// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';

// export default function Callback() {
//     const router = useRouter();

//     useEffect(() => {
//         const checkAuth = async () => {
//             const { data: sessionData } = await supabase.auth.getSession();

//             if (sessionData?.session) {
//                 router.replace('/dashboard'); // Redirect to dashboard
//             } else {
//                 // Redirect to home if session is missing
//                 router.replace('/');
//             }
//         };

//         // Listen for auth changes (important for magic link authentication)
//         const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//             if (session) {
//                 router.replace('/dashboard'); // Redirect once session is set
//             }
//         });

//         checkAuth();

//         return () => {
//             authListener.subscription.unsubscribe(); // Cleanup listener
//         };
//     }, [router]);

//     return <p>Redirecting...</p>;
// }


// attempt #2 
// 'use client';

// import { useEffect } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { useRouter } from 'next/navigation';

// export default function Callback() {
//     const router = useRouter();
//     const supabase = createClientComponentClient();

//     useEffect(() => {
//         const handleSession = async () => {
//             const { data: { session } } = await supabase.auth.getSession();
//             console.log("Session Data =====>", session)
//             if (session) {
//                 // Redirect to dashboard if session exists
//                 router.replace('/dashboard');
//             } else {
//                 // Redirect to home if session is missing
//                 router.replace('/');
//             }
//         };

//         handleSession();
//     }, [router, supabase]);

//     return <div>Logging you in...</div>;
// }


// attempt #3 
'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Callback() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const handleSession = async () => {
            console.log("🔄 Callback: Checking session...");

            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("❌ Supabase Session Fetch Error:", error.message);
            }

            console.log("✅ Callback Session Data:", session);

            if (session) {
                // 🔥 Store session in cookies so middleware can access it
                const { error: setError } = await supabase.auth.setSession({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                });

                if (setError) {
                    console.error("❌ Error setting session cookies:", setError.message);
                } else {
                    console.log("🍪 Session stored in cookies!");
                }

                router.replace('/dashboard');
            } else {
                router.replace('/');
            }
        };

        handleSession();
    }, [router, supabase]);

    return <div>Logging you in...</div>;
};
