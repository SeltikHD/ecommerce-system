// Update one user adress
import type { Address } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { callbacks } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export type AddressUpdate = Omit<Address, 'userId' | 'createdAt' | 'updatedAt'>;

export async function DELETE(req: Request) {
    const { id } = (await req.json()) as AddressUpdate;

    const session = await getServerSession(callbacks);

    if (typeof session?.user?.id !== 'string') {
        return NextResponse.json({ error: 'Missing authenticated' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (exists) {
        const addressDB = await prisma.address.delete({
            where: {
                id,
                userId: session.user.id,
            },
        });

        return NextResponse.json(addressDB);
    } else {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
}
