import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Get session
    const { data: { session } } = await supabase.auth.getSession();

    // Redirect unauthenticated users trying to access /dashboard
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}

// Protect only the /dashboard route
export const config = {
    matcher: ['/dashboard/:path*'],
};
