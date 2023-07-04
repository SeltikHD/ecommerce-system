import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { getServerSession } from 'next-auth';
import SearchBar from './search-bar';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

const Navbar = async ({ searchPlaceholder, homeText }: { searchPlaceholder: string; homeText: string }) => {
    const session = await getServerSession();
    const categories = await prisma.category.findMany({ take: 6 });

    return (
        <header className="w-full bg-white fixed border-gray-300 border-b">
            <div className="w-full h-20 flex items-center justify-between">
                <Link href="/" className="px-6 hidden lg:block">
                    <Image src={process.env.NEXT_PUBLIC_SITE_URL + '/logo.svg'} alt="Logo" width={160} height={40} />
                </Link>
                <SearchBar
                    className="ml-[2%] w-[65%] lg:ml-0 lg:w-[50%]"
                    placeholder={searchPlaceholder ?? 'What are you looking for?'}
                />
                <div className="flex items-center space-x-4 mr-2 sm:mr-4 lg:mr-6">
                    <FiShoppingCart className="text-gray-800 text-3xl cursor-pointer hover:text-gray-600" />
                    <Link href={!session?.user ? '/login' : '/account'}>
                        {session?.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.firstName + ' avatar'}
                                width={48}
                                height={48}
                            />
                        ) : (
                            <FiUser className="text-gray-800 border-black border-2 p-2 rounded-full text-5xl cursor-pointer hover:text-gray-600" />
                        )}
                    </Link>
                </div>
            </div>
            <nav className="hidden lg:block w-full">
                <ul className="block lg:flex">
                    <ListItem className="text-dark hover:text-primary border-gray-300 border-r px-8" NavLink="/">
                        {homeText}
                    </ListItem>
                    {categories.map(({ id, name }) => (
                        <ListItem
                            key={'NavBar-' + id}
                            className="text-dark hover:text-primary border-gray-300 border-r px-8"
                            NavLink={`/${name}`}
                        >
                            {name}
                        </ListItem>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;

const ListItem = ({
    children,
    className,
    NavLink,
}: {
    children: React.ReactNode;
    className?: string;
    NavLink: string;
}) => {
    return (
        <>
            <li>
                <Link
                    href={NavLink}
                    className={clsx('flex justify-center items-center py-2 text-base font-medium', className)}
                >
                    {children}
                </Link>
            </li>
        </>
    );
};
