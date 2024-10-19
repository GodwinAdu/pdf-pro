import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('credentials'); // Assuming token info is stored in cookies

    // Public routes that do not require authentication
    const publicRoutes = [
        '/',
        '/sign-in',
        '/sign-up',
        '/forgot-password',
        '/reset-password',
        '/authenticate',
        '/api/uploadthing',
        '/api/socket/direct-messages',
        '/api/socket/direct-messages/directMessageId',
        '/api/socket/messages',
        '/api/socket/messages/messageId',
        '/api/trpc',
    ];

    // Allow access to public routes without checking token
    if (publicRoutes.includes(pathname)) {
        // Redirect authenticated users trying to access /sign-in or /sign-up back to home
        if ((pathname === '/sign-in' || pathname === '/sign-up') && token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Redirect to sign-in if no token is present
    if (!token) {
        const originUrl = new URL(`/sign-in?origin=${encodeURIComponent(pathname)}`, request.url);
        return NextResponse.redirect(originUrl);
    }

    let tokenExpired = false;

    if (token) {
        try {
            const { payload } = await jwtVerify(token.value, SECRET_KEY);

            const userVerified = payload?.emailVerified;

            console.log(userVerified,"user verified");

            // Redirect to verification page if the user is not verified
            if (!userVerified && pathname !== '/authenticate') {
                const originUrl = new URL(`/authenticate?origin=${encodeURIComponent(pathname)}`, request.url);
                return NextResponse.redirect(originUrl);
            }

            // Check if the token has expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp! < currentTime) {
                tokenExpired = true;
            }
        } catch (error) {
            console.error('Invalid token:', error);
            tokenExpired = true;
        }
    }

    // Redirect to sign-in if the token is expired
    if (tokenExpired) {
        const originUrl = new URL(`/sign-in?origin=${encodeURIComponent(pathname)}`, request.url);
        return NextResponse.redirect(originUrl);
    }

    // Allow authenticated users to access the route
    return NextResponse.next();
};


// Add this to your next.config.js file to enable server-side rendering for API routes
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
