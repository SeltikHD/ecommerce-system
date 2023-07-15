// Add a new Address to user
import type { Address } from '@prisma/client';
import { returnIfCorrectType } from '@/utils/types';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { callbacks } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export type AddressAdd = Omit<Address, 'userId' | 'id' | 'createdAt' | 'updatedAt'>;

export async function POST(req: Request) {
    const address = (await req.json()) as AddressAdd;
    const session = await getServerSession(callbacks);

    if (typeof session?.user?.id !== 'string') {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (exists) {
        if (
            (Object.keys(address) as Array<keyof typeof address>)
                .map(value => returnIfCorrectType(address[value], 'string'))
                .includes(undefined)
        ) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const addressDB = await prisma.address.create({
            data: {
                ...address,
                userId: session.user.id,
            },
        });

        return NextResponse.json(addressDB);
    } else {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
}
