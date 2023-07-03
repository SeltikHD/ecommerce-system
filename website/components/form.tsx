'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import LoadingDots from '@/components/loading-dots';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Form({ type }: { type: 'login' | 'register' }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                setLoading(true);

                const name = splitFullName(e.currentTarget.fullName?.value ?? '');

                if (type === 'login') {
                    signIn('credentials', {
                        redirect: false,
                        email: e.currentTarget.email?.value,
                        password: e.currentTarget.password?.value,
                    }).then(d => {
                        if (d?.error) {
                            setLoading(false);
                            toast.error(d.error);
                        } else {
                            router.refresh();
                            router.push('/protected');
                        }
                    });
                } else if (name !== null) {
                    const { firstName, lastName } = name;

                    fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            firstName,
                            lastName,
                            email: e.currentTarget.email.value,
                            password: e.currentTarget.password.value,
                        }),
                    }).then(async res => {
                        setLoading(false);
                        if (res.status === 200) {
                            toast.success('Account created! Redirecting to login...');
                            setTimeout(() => {
                                router.push('/login');
                            }, 2000);
                        } else {
                            const { error } = await res.json();
                            toast.error(error);
                        }
                    });
                } else {
                    setLoading(false);
                    toast.error('Please enter your first and last name');
                }
            }}
            className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        >
            {type === 'register' && (
                <div>
                    <label htmlFor="email" className="block text-xs text-gray-600 uppercase">
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        pattern="\S+\s+\S+.*"
                        title="Please enter your first and last name"
                        required
                        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    />
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-xs text-gray-600 uppercase">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="myemail@email.com"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-xs text-gray-600 uppercase">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
            </div>
            <button
                disabled={loading}
                className={`${
                    loading
                        ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                        : 'border-black bg-black text-white hover:bg-white hover:text-black'
                } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
                {loading ? <LoadingDots color="#808080" /> : <p>{type === 'login' ? 'Sign In' : 'Sign Up'}</p>}
            </button>
            {type === 'login' ? (
                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-semibold text-gray-800">
                        Sign up
                    </Link>{' '}
                    for free.
                </p>
            ) : (
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-gray-800">
                        Sign in
                    </Link>{' '}
                    instead.
                </p>
            )}
        </form>
    );
}

function splitFullName(fullName: string): { firstName: string; lastName: string } | null {
    const names = fullName.split(' ');

    if (names.length >= 2) {
        const firstName = names[0] ?? '';
        const lastName = names[-1] ?? '';

        return { firstName, lastName };
    }

    return null;
}
