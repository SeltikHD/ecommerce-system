// Add a new Address to user
import type { Address } from '@prisma/client';
import { returnIfCorrectType } from '@/utils/types';
import { getServerSession } from 'next-auth';
import { postalCodeRegex } from '@/utils/regex';
import { NextResponse } from 'next/server';
import { callbacks } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export type AddressAdd = Omit<Address, 'userId' | 'id' | 'createdAt' | 'updatedAt'>;

export async function PUT(req: Request) {
    const { name, street, number, neighborhood, city, state, postalCode } = (await req.json()) as AddressAdd;

    if (postalCodeRegex.test(postalCode) === false) {
        return NextResponse.json({ error: 'Invalid postal code' }, { status: 400 });
    }

    const address = { name, street, number, neighborhood, city, state, postalCode };

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

        return NextResponse.json(addressDB, { status: 201 });
    } else {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
}
