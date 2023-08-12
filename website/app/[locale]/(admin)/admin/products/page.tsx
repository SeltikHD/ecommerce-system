//Make a manage products page with a table of products and a button to add a new product.
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Manage() {
    const t = useTranslations();

    return (
        <>
            <div className="fixed bottom-8 right-8">
                <Link href="admin/products/new">
                    <h1 className="bg-blue-500 text-white w-16 h-16 rounded-full shadow hover:bg-blue-600 flex items-center justify-center text-4xl">
                        +
                    </h1>
                </Link>
            </div>
        </>
    );
}
