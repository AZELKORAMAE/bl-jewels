import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isFirstLogin = token?.mustChangePassword === true;
        const isLoginPage = req.nextUrl.pathname === '/admin/login';
        const isFirstLoginPage = req.nextUrl.pathname === '/admin/first-login';

        // Rediriger vers login si non authentifié et essaie d'accéder à l'admin
        if (!isAuth && !isLoginPage) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        // Rediriger vers first-login si changement de mot de passe requis
        if (isAuth && isFirstLogin && !isFirstLoginPage) {
            return NextResponse.redirect(new URL('/admin/first-login', req.url));
        }

        // Empêcher l'accès à first-login si déjà changé
        if (isAuth && !isFirstLogin && isFirstLoginPage) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Toujours autorisé pour la page de login
                if (req.nextUrl.pathname === '/admin/login') return true;
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ['/admin/:path*'],
};
