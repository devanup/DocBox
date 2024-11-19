'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createAccount, signInUser } from '@/lib/actions/user.actions';
import OTPModal from './OTPModal';

type AuthFormType = 'sign-in' | 'sign-up';

const authFormSchema = (type: AuthFormType) => {
	return z.object({
		email: z.string().email(),
		fullName:
			type === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
	});
};

const AuthForm = ({ type }: { type: AuthFormType }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [accountId, setAccountId] = useState<string | null>(null);

	const formSchema = authFormSchema(type);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: '',
			email: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setErrorMessage(''); // clear any previous error messages

		try {
			const user =
				type === 'sign-up'
					? await createAccount(values.fullName || '', values.email)
					: await signInUser(values.email);

			if (user) setAccountId(user.accountId);
		} catch {
			setErrorMessage('Failed to create account. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='auth-form'>
					<h1 className='form-title'>
						{type === 'sign-in' ? 'Sign In' : 'Sign Up'}
					</h1>
					{type === 'sign-up' && (
						<FormField
							control={form.control}
							name='fullName'
							render={({ field }) => (
								<FormItem>
									<div className='shad-form-item'>
										<FormLabel className='shad-form-label'>Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter your full name'
												className='shad-input'
												{...field}
											/>
										</FormControl>
									</div>
									<FormMessage className='shad-form-message' />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<div className='shad-form-item'>
									<FormLabel className='shad-form-label'>Email</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter your email'
											className='shad-input'
											{...field}
										/>
									</FormControl>
								</div>
								<FormMessage className='shad-form-message' />
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='form-submit-button ease-transition'
						disabled={isLoading}
					>
						{type === 'sign-in' ? 'Sign In' : 'Sign Up'}
						{isLoading && (
							<Image
								src='/icons/loader.svg'
								alt='loader'
								width={20}
								height={20}
								className='ml-2 animate-spin'
							/>
						)}
					</Button>

					{errorMessage && <p className='error-message'>{errorMessage}</p>}

					<div className='body-2 flex justify-center'>
						<p className='text-light-100'>
							{type === 'sign-in'
								? "Don't have an account? "
								: 'Already have an account? '}
							<Link
								href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
								className='text-brand-100 hover:text-brand-100/90 ease-transition ml-1 font-medium'
							>
								{type === 'sign-in' ? 'Sign Up' : 'Sign In'}
							</Link>
						</p>
					</div>
				</form>
			</Form>
			{accountId && (
				<OTPModal accountId={accountId} email={form.getValues('email')} />
			)}
		</>
	);
};

export default AuthForm;
