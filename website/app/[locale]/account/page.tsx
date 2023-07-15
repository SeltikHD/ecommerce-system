import type { Address } from '@prisma/client';
import type { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { useTranslations } from 'next-intl';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import UserAccount from './content';
import prisma from '@/lib/prisma';

export default async function Account() {
    const session = await getServerSession(callbacks);

    if (!session?.user) {
        redirect('/login');
    }

    const addresses = await prisma.address.findMany({
        where: {
            userId: session.user.id,
        },
    });

    return <Content user={session.user} addresses={addresses} />;
}

function Content({ user, addresses }: { user: User; addresses: Address[] }) {
    const t = useTranslations();

    return (
        <UserAccount
            texts={{
                name: t('Account.name'),
                phoneNumber: t('Account.phoneNumber'),
                updateButton: t('Account.updateButton'),
                userUpdated: t('Account.userUpdated'),
                userUpdateFailed: t('Account.userUpdateFailed'),
                signOut: t('Account.signOut'),
                email: t('Account.email'),

                addressName: t('Account.addressName'),
                addresses: t('Account.addresses'),
                fullAddress: t('Account.fullAddress'),
                noneAddresses: t('Account.noneAddresses'),
                addAddress: t('Account.addAddress'),
                addressAdded: t('Account.addressAdded'),
                addressAddFailed: t('Account.addressAddFailed'),
                addressUpdated: t('Account.addressUpdated'),
                addressUpdateFailed: t('Account.addressUpdateFailed'),
                addressDeleted: t('Account.addressDeleted'),
                addressDeleteFailed: t('Account.addressDeleteFailed'),
                addressDeleteConfirm: t('Account.addressDeleteConfirm'),
                addressDeleteConfirmTitle: t('Account.addressDeleteConfirmTitle'),
                yes: t('Account.yes'),
                no: t('Account.no'),
                street: t('Account.street'),
                number: t('Account.number'),
                neighborhood: t('Account.neighborhood'),
                city: t('Account.city'),
                state: t('Account.state'),
                postalCode: t('Account.postalCode'),
            }}
            addresses={addresses}
            user={user}
        />
    );
}
