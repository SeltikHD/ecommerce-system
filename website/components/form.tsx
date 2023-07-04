'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import LoadingDots from './loading-dots';
import toast from 'react-hot-toast';
import Link from 'next/link';

type FormValues = {
    fullName?: string;
    email: string;
    password: string;
};

type FormProps = {
    type: 'login' | 'register';
    texts: {
        fullNameLabel: string;
        fullNamePlaceholder: string;
        fullNamePattern: string;
        fullNameError: string;
        emailError: string;
        passwordError: string;
        emailAddressLabel: string;
        emailAddressPlaceholder: string;
        passwordLabel: string;
        buttonLabelSignIn: string;
        buttonLabelSignUp: string;
        signInText: string;
        signUpText: string;
        signUpLinkText: string;
        signInLinkText: string;
    };
};

export default function Form({ type, texts }: FormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        setLoading(true);

        if (type === 'login') {
            const { email, password } = data;
            const response = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (response?.error) {
                setLoading(false);
                toast.error(response.error);
            } else {
                router.push('/');
            }
        } else {
            const { fullName, email, password } = data;

            if (fullName) {
                const name = splitFullName(fullName);

                if (name !== null) {
                    const { firstName, lastName } = name;

                    fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            firstName,
                            lastName,
                            email,
                            password,
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
                    toast.error(texts.fullNameError);
                }
            } else {
                setLoading(false);
                toast.error(texts.fullNameError);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
            {type === 'register' && (
                <div>
                    <label htmlFor="fullName" className="block text-xs text-gray-600 uppercase">
                        {texts.fullNameLabel}
                    </label>
                    <input
                        id="fullName"
                        {...register('fullName', {
                            required: true,
                            pattern: new RegExp(texts.fullNamePattern),
                        })}
                        type="text"
                        placeholder={texts.fullNamePlaceholder}
                        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    />
                    {errors.fullName && <p className="text-xs text-red-500">{texts.fullNameError}</p>}
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-xs text-gray-600 uppercase">
                    {texts.emailAddressLabel}
                </label>
                <input
                    id="email"
                    {...register('email', { required: true })}
                    type="email"
                    placeholder={texts.emailAddressPlaceholder}
                    autoComplete="email"
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                {errors.email && <p className="text-xs text-red-500">{texts.emailError}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-xs text-gray-600 uppercase">
                    {texts.passwordLabel}
                </label>
                <input
                    id="password"
                    {...register('password', { required: true })}
                    type="password"
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                {errors.password && <p className="text-xs text-red-500">{texts.passwordError}</p>}
            </div>
            <button
                disabled={loading}
                className={`${
                    loading
                        ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                        : 'border-black bg-black text-white hover:bg-white hover:text-black'
                } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
                {loading ? (
                    <LoadingDots color="#808080" />
                ) : (
                    <p>{type === 'login' ? texts.buttonLabelSignIn : texts.buttonLabelSignUp}</p>
                )}
            </button>
            {type === 'login' ? (
                <p className="text-center text-sm text-gray-600">
                    {texts.signUpText}{' '}
                    <Link href="/register" className="font-semibold text-gray-800">
                        {texts.signUpLinkText}
                    </Link>
                </p>
            ) : (
                <p className="text-center text-sm text-gray-600">
                    {texts.signInText}{' '}
                    <Link href="/login" className="font-semibold text-gray-800">
                        {texts.signInLinkText}
                    </Link>
                </p>
            )}
        </form>
    );
}

function splitFullName(fullName: string): { firstName: string; lastName: string } | null {
    const names = fullName.split(' ');

    if (names.length >= 2) {
        const firstName = names[0] ?? '';
        const lastName = names[names.length - 1] ?? '';

        return { firstName, lastName };
    }

    return null;
}
