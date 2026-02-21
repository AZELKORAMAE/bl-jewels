import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Identifiants requis');
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email.toLowerCase() });

                if (!user) {
                    throw new Error('Utilisateur non trouvé');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Mot de passe incorrect');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    mustChangePassword: user.mustChangePassword,
                    isAdmin: user.isAdmin,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.mustChangePassword = (user as any).mustChangePassword;
                token.isAdmin = (user as any).isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).mustChangePassword = token.mustChangePassword;
                (session.user as any).isAdmin = token.isAdmin;
            }
            return session;
        }
    },
    pages: {
        signIn: '/admin/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
