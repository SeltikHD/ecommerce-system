import { DefaultSession } from 'next-auth';

type User = {
    id: number;
    isAdmin: boolean;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string | null;
    phoneNumber: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
} & DefaultSession['user'];

declare module 'next-auth' {
    interface Session {
        user: User;
    }

    type User = User;
}
