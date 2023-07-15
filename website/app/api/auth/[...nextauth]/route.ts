import NextAuth, { type NextAuthOptions, type AuthOptions, type CallbacksOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';

export const adapter = PrismaAdapter(prisma);

export const callbacks = {
    callbacks: {
        async session({ session, token, user }) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    id: { in: token?.id as string | undefined },
                },
            });

            session.user = dbUser ?? user;

            return session;
        },
    },
} as Partial<Omit<AuthOptions, 'callbacks'>> & {
    callbacks?: Omit<AuthOptions['callbacks'], 'session'> & {
        session?: (...args: Parameters<CallbacksOptions['session']>) => any;
    };
};

export const authOptions: NextAuthOptions = {
    adapter: adapter as Adapter,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {};

                if (!email || !password) {
                    throw new Error('Missing username or password');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                if (!user?.password) {
                    throw new Error(
                        'Your account is not set up for password authentication. Please use a different provider.',
                    );
                }

                // if user doesn't exist or password doesn't match
                if (!user || !(await compare(password, user.password))) {
                    throw new Error('Invalid username or password');
                }

                return user;
            },
        }),
    ],
    callbacks: callbacks.callbacks,
    pages: {
        signIn: '/login',
        signOut: '/signout',
        newUser: '/account',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
