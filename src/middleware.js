import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const { data: { session } } = await supabase.auth.getSession();

    // If no session exists and user tries to access protected route, redirect to login
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/callback']
};