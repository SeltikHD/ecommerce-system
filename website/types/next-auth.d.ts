import type { DefaultSession } from 'next-auth';
import type { Role } from '@prisma/client';

type CustomUser = {
    id: number;
    role: Role;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    image: string | null;
    address: string | null;
    phoneNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
} & DefaultSession['user'];

declare module 'next-auth' {
    interface Session {
        user: User;
    }

    type User = CustomUser;
}
