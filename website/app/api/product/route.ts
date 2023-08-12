import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(req: Request) {
    const { id, category } = await req.json();
    let { method } = await req.json();

    if (!['AND', 'OR'].includes(method)) {
        return NextResponse.json({ error: 'Invalid method in DB' }, { status: 400 });
    }
    method = method as 'AND' | 'OR';

    const where = {} as Prisma.ProductWhereInput;

    return prisma.product.findMany({ where });
}
