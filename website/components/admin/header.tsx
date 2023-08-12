import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type { Role } from '@prisma/client';
import type { User } from 'next-auth';
import Link from 'next/link';

import { BsFillBoxSeamFill } from 'react-icons/bs';
import { AiOutlineHome } from 'react-icons/ai';

interface Texts {
    dashboard: string;
    products: string;
}

export const Drawer = async ({
    drawerId,
    user,
    texts,
    ...props
}: { drawerId: string; user: User; texts: Texts } & DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>) => {
    const { role } = user;

    return (
        <div className="drawer lg:drawer-open">
            <input id={drawerId} type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center" {...props} />
            <div className="drawer-side">
                {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
                <label htmlFor={drawerId} className="drawer-overlay" />
                <ul className="menu p-4 w-80 h-full bg-base-300 text-base-content gap-y-2">
                    <li>
                        <div className="flex items-end justify-start">
                            <AiOutlineHome size={22} />
                            <Link href="/admin">{texts.dashboard}</Link>
                        </div>
                    </li>
                    {(['SUPER_ADMIN', 'STOCK', 'MARKETING'] as Role[]).includes(role) && (
                        <li>
                            <div className="flex items-end justify-start">
                                <BsFillBoxSeamFill size={22} />
                                <Link href="/admin/products">{texts.products}</Link>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

/*
<div className="drawer-content flex flex-col items-center justify-center">
    <label htmlFor={drawerId} className="btn btn-primary drawer-button lg:hidden">
        Open drawer
    </label>
</div>
*/
