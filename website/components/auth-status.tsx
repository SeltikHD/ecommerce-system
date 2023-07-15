import { getServerSession } from 'next-auth/next';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';

export default async function AuthStatus() {
    const session = await getServerSession(callbacks);

    return (
        <div className="absolute top-5 w-full flex justify-center items-center">
            {session && <p className="text-stone-200 text-sm">Signed in as {session.user?.email}</p>}
        </div>
    );
}
