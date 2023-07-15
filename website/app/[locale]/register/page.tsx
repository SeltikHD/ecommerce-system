import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Form from '@/components/form';
import Link from 'next/link';

export default function SignUp() {
    const t = useTranslations();

    return (
        <div className="flex h-[80vh] items-center justify-center bg-gray-50">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            priority
                            alt="Logo"
                            className="h-10 w-10 rounded-full"
                            width={20}
                            height={20}
                        />
                    </Link>
                    <h3 className="text-xl font-semibold">{t('SignUp.title')}</h3>
                    <p className="text-sm text-gray-500">{t('SignUp.description')}</p>
                </div>
                <Form
                    texts={{
                        emailAddressLabel: t('Components.LoginForm.emailAddressLabel'),
                        emailAddressPlaceholder: t('Components.LoginForm.emailAddressPlaceholder'),
                        passwordLabel: t('Components.LoginForm.passwordLabel'),
                        fullNameLabel: t('Components.LoginForm.fullNameLabel'),
                        fullNamePlaceholder: t('Components.LoginForm.fullNamePlaceholder'),
                        fullNamePattern: t('Components.LoginForm.fullNamePattern'),
                        buttonLabelSignIn: t('Components.LoginForm.buttonLabelSignIn'),
                        buttonLabelSignUp: t('Components.LoginForm.buttonLabelSignUp'),
                        emailError: t('Components.LoginForm.emailError'),
                        passwordError: t('Components.LoginForm.passwordError'),
                        fullNameError: t('Components.LoginForm.fullNameError'),
                        signInLinkText: t('Components.LoginForm.signInLinkText'),
                        signUpLinkText: t('Components.LoginForm.signUpLinkText'),
                        signInText: t('Components.LoginForm.signInText'),
                        signUpText: t('Components.LoginForm.signUpText'),
                        signUpSuccess: t('Components.LoginForm.signUpSuccess'),
                        signUpFailed: t('Components.LoginForm.signUpFailed'),
                    }}
                    type="register"
                />
            </div>
        </div>
    );
}
