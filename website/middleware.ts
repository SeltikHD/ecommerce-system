import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'pt'];
const publicPages = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale: 'pt',
});

const authMiddleware = withAuth(
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => token !== null,
        },
        pages: {
            signIn: '/login',
        },
    },
);

export default function middleware(req: NextRequest) {
    const publicPathnameRegex = RegExp(`^(/(${locales.join('|')}))?(${publicPages.join('|')})?/?$`, 'i');
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
        return intlMiddleware(req);
    } else {
        return (authMiddleware as any)(req);
    }
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
