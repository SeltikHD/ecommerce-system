'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { LiaSearchSolid } from 'react-icons/lia';

type FormValues = {
    search: string;
};

export default function SearchBar({
    defaultSearch,
    placeholder,
    className,
}: {
    defaultSearch?: string;
    placeholder?: string;
    className?: string;
}) {
    const { register, handleSubmit } = useForm<FormValues>({ defaultValues: { search: defaultSearch } });
    const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

    return (
        <form className={`flex ${className ?? ''}`} onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register('search')}
                type="text"
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <LiaSearchSolid />
            </button>
        </form>
    );
}
