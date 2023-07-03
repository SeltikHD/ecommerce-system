import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { firstName, lastName, email, password } = await req.json();

    if (
        typeof firstName !== 'string' ||
        typeof lastName !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
    ) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (exists) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    } else {
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: await hash(password, 10),
            },
        });

        return NextResponse.json(user);
    }
}
