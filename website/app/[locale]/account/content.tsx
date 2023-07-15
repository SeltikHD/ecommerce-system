'use client';

import type { Address, User } from '@prisma/client';
import type { AddressUpdate } from '@/app/api/update/user/address/update';
import type { AddressAdd } from '@/app/api/update/user/address/add';
import { useEffect, useState } from 'react';
import { replaceValues } from '@/utils/string';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import SignOut from '@/components/sign-out';
import toast from 'react-hot-toast';
import Image from 'next/image';
import clsx from 'clsx';

interface UserAccountProps {
    user: User;
    addresses: Address[];
    texts: {
        name: string;
        email: string;
        phoneNumber: string;
        updateButton: string;
        userUpdated: string;
        userUpdateFailed: string;
        signOut: string;
    } & AddressTexts;
}

interface AddressTexts {
    addressName: string;
    addresses: string;
    fullAddress: string;
    noneAddresses: string;
    addAddress: string;
    addressAdded: string;
    addressAddFailed: string;
    addressUpdated: string;
    addressUpdateFailed: string;
    addressDeleted: string;
    addressDeleteFailed: string;
    addressDeleteConfirm: string;
    addressDeleteConfirmTitle: string;
    yes: string;
    no: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
}

const UserAccount = ({ user, addresses, texts }: UserAccountProps) => {
    const router = useRouter();
    const [blockForm, setBlockForm] = useState(true);

    type FormValues = {
        name: string;
        phoneNumber?: string;
    };

    const { name, email, phoneNumber, image } = user;

    const { register, handleSubmit, setValue } = useForm<FormValues>({
        defaultValues: {
            name: name ?? undefined,
            phoneNumber: phoneNumber ?? undefined,
        },
    });

    useEffect(() => {
        if (name) {
            setValue('name', name);
        }

        if (phoneNumber) {
            setValue('phoneNumber', phoneNumber);
        }

        setBlockForm(false);
    }, [name, phoneNumber, setValue]);

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);

        try {
            const response = await fetch('/api/update/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...user, ...data }),
            });

            if (response.ok) {
                toast.success(texts.userUpdated);

                setTimeout(() => router.refresh(), 2000);
            } else {
                toast.error(texts.userUpdateFailed);
            }
        } catch (error) {
            toast.error(`${texts.userUpdateFailed}: ${error?.toString() ?? 'unknown error'}`);
        }

        setLoading(false);
    };

    return (
        <>
            <dialog id="addresses" className="modal">
                <form
                    method="dialog"
                    className="modal-box w-screen h-screen max-w-none max-h-none lg:modal-box lg:h-fit"
                >
                    <button className="btn btn-sm btn-circle btn-ghost border-black border absolute right-1 top-1">
                        X
                    </button>
                    <Addresses addresses={addresses} texts={{ ...texts }} />
                </form>
            </dialog>
            <div className="flex flex-col items-center w-full gap-4 mt-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4 p-10 py-7 rounded-lg border-black border"
                >
                    {image && (
                        <Image
                            src={image}
                            alt="The user avatar"
                            width={280}
                            height={280}
                            className="rounded-full border-black border mb-8"
                        />
                    )}
                    <input
                        type="text"
                        id="name"
                        className="input w-full input-bordered"
                        placeholder={texts.name}
                        {...register('name')}
                        disabled={blockForm}
                    />
                    {email && (
                        <input
                            type="text"
                            id="name"
                            className="input w-full input-bordered"
                            placeholder={texts.email}
                            value={email}
                            disabled
                        />
                    )}
                    <input
                        type="text"
                        id="phoneNumber"
                        className="input w-full input-bordered"
                        placeholder={texts.phoneNumber}
                        {...register('phoneNumber')}
                        disabled={blockForm}
                    />
                    <button
                        type="button"
                        className="btn capitalize input input-bordered"
                        onClick={() => (window as any).addresses.showModal()}
                        disabled={blockForm}
                    >
                        {texts.addresses}
                    </button>
                    <div className="flex justify-evenly">
                        <SignOut type="button" className="btn btn-error">
                            {texts.signOut}
                        </SignOut>
                        <button type="submit" className="btn btn-primary" disabled={loading || blockForm}>
                            {texts.updateButton}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

function Addresses({ addresses, texts }: { addresses: Address[]; texts: AddressTexts }) {
    const [mode, setMode] = useState<'edit' | 'add' | null>(null);

    return (
        <div className="flex flex-col items-center h-full w-full gap-4 mt-4 space-y-4 p-10 py-7 rounded-lg">
            <h1 className="text-2xl font-bold">{texts.addresses}</h1>
            <div className={clsx('flex flex-col space-y-4', { hidden: mode !== null })}>
                {addresses.length > 0 ? (
                    addresses.map(({ id, name, street, number, neighborhood, city, state, postalCode }) => (
                        <div key={'address-' + id} className="flex flex-col space-y-2">
                            <div className="flex justify-between">
                                <h1 className="text-xl font-bold">{name}</h1>
                                <button className="btn btn-sm btn-circle btn-ghost">X</button>
                            </div>
                            <p className="text-lg">
                                {replaceValues(texts.fullAddress, {
                                    street,
                                    number,
                                    neighborhood,
                                    city,
                                    state,
                                    postalCode,
                                })}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-lg">{texts.noneAddresses}...</p>
                )}
                <button
                    type="button"
                    className="btn btn-success btn-circle text-2xl absolute bottom-2 right-2"
                    onClick={() => setMode('add')}
                >
                    +
                </button>
            </div>
            <Form className={clsx({ hidden: mode === null })} texts={texts} dissmiss={() => setMode(null)} />
        </div>
    );
}

const Form = ({ className, texts, dissmiss }: { className: string; texts: AddressTexts; dissmiss: () => void }) => {
    const router = useRouter();

    const { register, handleSubmit, formState } = useForm<AddressAdd | AddressUpdate>();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: AddressAdd | AddressUpdate) => {
        setLoading(true);

        try {
            const response = await fetch('/api/update/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(texts.addressAdded);

                setTimeout(() => router.refresh(), 2000);
            } else {
                toast.error(texts.addressAddFailed);
            }
        } catch (error) {
            toast.error(`${texts.addressAddFailed}: ${error?.toString() ?? 'unknown error'}`);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={clsx('flex flex-col space-y-4', className)}>
            <input
                type="text"
                id="name"
                className="input w-full input-bordered"
                placeholder={texts.addressName}
                {...register('name', { required: true })}
            />
            <input
                type="text"
                id="street"
                className="input w-full input-bordered"
                placeholder={texts.street}
                {...register('street', { required: true })}
            />
            <input
                type="text"
                id="number"
                className="input w-full input-bordered"
                placeholder={texts.number}
                {...register('number', { required: true })}
            />
            <input
                type="text"
                id="neighborhood"
                className="input w-full input-bordered"
                placeholder={texts.neighborhood}
                {...register('neighborhood', { required: true })}
            />
            <input
                type="text"
                id="city"
                className="input w-full input-bordered"
                placeholder={texts.city}
                {...register('city', { required: true })}
            />
            <input
                type="text"
                id="state"
                className="input w-full input-bordered"
                placeholder={texts.state}
                {...register('state', { required: true })}
            />
            <input
                type="text"
                id="postalCode"
                className="input w-full input-bordered"
                placeholder={texts.postalCode}
                {...register('postalCode', { required: true })}
            />
            <div className="flex justify-evenly">
                <button type="button" className="btn btn-error" onClick={dissmiss}>
                    {texts.no}
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading || !formState.isValid}>
                    {texts.yes}
                </button>
            </div>
        </form>
    );
};

export default UserAccount;
