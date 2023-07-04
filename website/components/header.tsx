'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="flex items-center w-full bg-white fixed">
            <div className="container">
                <div className="relative flex items-center justify-between -mx-4">
                    <div className="max-w-full px-8 w-60">
                        <Link href="/" className="block w-full py-5">
                            <Image
                                src={process.env.NEXT_PUBLIC_SITE_URL + '/vercel.svg'}
                                alt="Logo"
                                width={283}
                                height={64}
                            />
                        </Link>
                    </div>
                    <div className="flex items-center justify-between w-full px-4">
                        <div>
                            <button
                                onClick={() => setOpen(!open)}
                                id="navbarToggler"
                                className={clsx(
                                    open && 'navbarTogglerActive',
                                    'absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden',
                                )}
                            >
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color"></span>
                            </button>
                            <nav
                                id="navbarCollapse"
                                className={clsx(
                                    !open && 'hidden',
                                    'absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white py-5 px-6 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none',
                                )}
                            >
                                <ul className="block lg:flex">
                                    <ListItem navItemStyles="text-dark hover:text-primary" NavLink="/">
                                        Home
                                    </ListItem>
                                    <ListItem navItemStyles="text-dark hover:text-primary" NavLink="/#">
                                        Payment
                                    </ListItem>
                                    <ListItem navItemStyles="text-dark hover:text-primary" NavLink="/#">
                                        About
                                    </ListItem>
                                    <ListItem navItemStyles="text-dark hover:text-primary" NavLink="/#">
                                        Blog
                                    </ListItem>
                                </ul>
                            </nav>
                        </div>
                        <div className="justify-end hidden pr-16 sm:flex lg:pr-0">
                            <Link
                                href="/login"
                                className="py-3 text-base font-medium px-7 text-dark hover:text-primary"
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/register"
                                className="py-3 text-base font-medium text-white rounded-lg bg-primary px-7 hover:bg-opacity-90"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

const ListItem = ({
    children,
    navItemStyles,
    NavLink,
}: {
    children: React.ReactNode;
    navItemStyles: string;
    NavLink: string;
}) => {
    return (
        <>
            <li>
                <Link
                    href={NavLink}
                    className={clsx('flex py-2 text-base font-medium lg:ml-12 lg:inline-flex', navItemStyles)}
                >
                    {children}
                </Link>
            </li>
        </>
    );
};
