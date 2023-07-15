import { NextResponse } from 'next/server';
import { adapter } from '../[...nextauth]/route';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { fullName, email, password } = await req.json();

    if (
        typeof fullName !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        fullName.length <= 0 ||
        email.length <= 0 ||
        password.length <= 0
    ) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const exists = await prisma.user.findFirst({
        where: {
            email,
            password: { not: null },
        },
    });

    if (exists) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    } else if (adapter.createUser === undefined) {
        return NextResponse.json({ error: 'User creation is not supported' }, { status: 400 });
    } else {
        const userAdapter = await adapter.createUser({ email, emailVerified: null, name: fullName });
        const user = await prisma.user.update({
            data: { password: await hash(password, 10) },
            where: { id: userAdapter.id },
        });

        return NextResponse.json(user);
    }
}
