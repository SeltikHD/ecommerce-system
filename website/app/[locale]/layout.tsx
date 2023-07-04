// These styles apply to every route in the application
import '@/styles/globals.css';
import { createTranslator, useLocale } from 'next-intl';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import AuthStatus from '@/components/auth-status';
import Navbar from '@/components/header';

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'pt' }];
}

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages = (await import(`../../translations/en.json`)).default;

    const t = createTranslator({ locale, messages });

    return {
        title: t('Locale.title'),
        description: t('Locale.description'),
        twitter: {
            card: 'summary_large_image',
            title: t('Locale.title'),
            description: t('Locale.description'),
        },
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
        themeColor: '#FFF',
    } as Metadata;
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const locale = useLocale();

    // Show a 404 error if the user requests an unknown locale
    if (params.locale !== locale) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body className={inter.variable}>
                <Toaster />
                <Suspense fallback="Loading...">
                    <AuthStatus />
                </Suspense>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
