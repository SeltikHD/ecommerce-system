import { createTranslator, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import Navbar from '@/components/header';

export default async function EcommerceLayout({
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

        const messages = (await import(`../../../translations/${locale}.json`)).default;

        const t = createTranslator({ locale, messages });

        return (
            <>
                <Navbar
                    homeText={t('Components.Header.home')}
                    searchPlaceholder={t('Components.SearchBar.placeholder')}
                />
                {children}
            </>
        );
    } catch {
        notFound();
    }
}
