// These styles apply to every route in the application
import '@/styles/globals.css';

import type { Metadata } from 'next';
import { createTranslator, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

/* TODO: Uncomment this to enable static generation
export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'pt' }];
}
*/

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    try {
        const messages = (await import(`../../translations/${locale}.json`)).default;

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
    } catch {
        notFound();
    }
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const locale = useLocale();

        // Show a 404 error if the user requests an unknown locale
        if (params.locale !== locale) {
            notFound();
        }

        return (
            <html data-theme="light" lang={locale}>
                <body className={inter.variable}>
                    <Toaster />
                    {children}
                </body>
            </html>
        );
    } catch {
        notFound();
    }
}
