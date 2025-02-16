// import { NextResponse } from 'next/server';
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// export async function middleware(request) {
//     console.log("🔄 Middleware is running...");

//     const response = NextResponse.next();
//     // const res = NextResponse.next();
//     const supabase = createMiddlewareClient({ req: request, res: response });

//     // Get session
//     const { data: { session } } = await supabase.auth.getSession();

//     // Redirect unauthenticated users trying to access /dashboard
//     if (!session && request.nextUrl.pathname.endsWith('/dashboard')) {
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     console.log("Session data ---->", data);

//     return response;
// }

// // Protect only the /dashboard route
// export const config = {
//     matcher: ['/dashboard/:path*', '/callback'],
// };


// attempt #2
// import { NextResponse } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// export async function middleware(req) {
//     console.log("🔄 Middleware is running...");

//     // Create response object
//     const res = NextResponse.next();

//     // Initialize Supabase middleware client
//     const supabase = createMiddlewareClient({ req, res });

//     // Get the session
//     const { data: { session }, error } = await supabase.auth.getSession();

//     if (error) {
//         console.error("❌ Supabase Auth Error:", error.message);
//     }

//     console.log("🔍 Session Data:", session);

//     // If no session exists and user tries to access `/dashboard`, redirect to home (`/`)
//     if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
//         console.log("🚫 No session found, redirecting to home...");
//         return NextResponse.redirect(new URL("/", req.url));
//     }

//     return res;
// }

// // Protect the `/dashboard` route
// export const config = {
//     matcher: ["/dashboard/:path*", '/callback'],
// };

// Attempt #3
import { NextResponse } from "next/server";
// import { createServerClient } from "@supabase/ssr";
import { createMiddlewareClient, createServerClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request) {
    console.log("🔄 Middleware is running...");
    const res = NextResponse.next();

    // Initialize Supabase middleware client
    // const supabase = createMiddlewareClient({ req, res });
    // console.log("Supabase ------------->", supabase)
    //     ``
    // // Ensure the session is available in cookies
    // await supabase.auth.getUser();
    // console.log("supabase auth ====> ", await supabase.auth.getUser())

    // // Get the session from cookies
    // const { data: { session }, error } = await supabase.auth.getSession();

    // if (error) {
    //     console.error("❌ Supabase Auth Error:", error.message);
    // }

    // console.log("🔍 Middleware Session Data:", session);

    // // If no session exists and user tries to access `/dashboard`, redirect to home (`/`)
    // if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    //     console.log("🚫 No session found, redirecting to home...");
    //     return NextResponse.redirect(new URL("/", req.url));
    // }

    try {
        // Create an unmodified response
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value),
                        );
                        response = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options),
                        );
                    },
                },
            },
        );

        // This will refresh session if expired - required for Server Components
        // https://supabase.com/docs/guides/auth/server-side/nextjs
        const user = await supabase.auth.getUser();

        // voice routes
        if (request.nextUrl.pathname.startsWith("/voice") && user.error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // if (request.nextUrl.pathname === "/" && !user.error) {
        //   return NextResponse.redirect(new URL("/voice", request.url));
        // }

        return response;
    } catch (e) {
        // If you are here, a Supabase client could not be created!
        // This is likely because you have not set up environment variables.
        // Check out http://localhost:3000 for Next Steps.
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }

    return res;
}

// Protect the `/dashboard` route
export const config = {
    // matcher: ["/dashboard/:path*", "/callback"],
    matcher: ["/dashboard/:path*", "/callback"],
};

