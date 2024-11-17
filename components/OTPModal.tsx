'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
	InputOTP,
	InputOTPGroup,
	// InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from './ui/button';
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

const OTPModal = ({
	accountId,
	email,
}: {
	accountId: string;
	email: string;
}) => {
	const [isOpen, setIsOpen] = useState(true); // once we have the accountId, it should already be open
	const [password, setPassword] = useState(''); // value of the OTP input
	const [isLoading, setIsLoading] = useState(false); // loading state
	const router = useRouter();

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// call the API to verify the OTP
			const sessionID = await verifySecret(accountId, password);

			if (sessionID) {
				// redirect to the home page
				router.push('/');
			}
		} catch (error) {
			console.log('Failed to verify OTP');
		}
		setIsLoading(false);
	};

	// function to resend the OTP incase the user didn't receive it or it expired
	const handleResendOTP = async () => {
		// call the API to resend the OTP
		await sendEmailOTP(email);
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent className='shad-alert-dialog'>
				<AlertDialogHeader className='relative flex justify-center'>
					<AlertDialogTitle className='h2 text-center'>
						Enter OTP
						<Image
							src='/icons/close-dark.svg'
							alt='close'
							width={20}
							height={20}
							onClick={() => setIsOpen(false)}
							className='otp-close-button'
						/>
					</AlertDialogTitle>
					<AlertDialogDescription className='subtitle-2 text-center text-light-100'>
						Enter the OTP sent to{' '}
						<span className='pl-1 text-brand-100'>{email}</span>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<InputOTP maxLength={6} value={password} onChange={setPassword}>
					<InputOTPGroup className='shad-otp'>
						<InputOTPSlot index={0} className='shad-otp-slot' />
						<InputOTPSlot index={1} className='shad-otp-slot' />
						<InputOTPSlot index={2} className='shad-otp-slot' />
						{/* </InputOTPGroup> */}
						{/* <InputOTPSeparator /> */}
						{/* <InputOTPGroup> */}
						<InputOTPSlot index={3} className='shad-otp-slot' />
						<InputOTPSlot index={4} className='shad-otp-slot' />
						<InputOTPSlot index={5} className='shad-otp-slot' />
					</InputOTPGroup>
				</InputOTP>

				<AlertDialogFooter>
					<div className='flex w-full flex-col gap-4'>
						<AlertDialogAction
							onClick={handleSubmit}
							className='shad-submit-btn h-12'
							type='button'
							disabled={isLoading}
						>
							{isLoading ? 'Verifying...' : 'Verify'}
							{isLoading && (
								<Image
									src='/icons/loader.svg'
									alt='loader'
									width={20}
									height={20}
									className='ml-2 animate-spin'
								/>
							)}
						</AlertDialogAction>
						<div className='flex items-center justify-center'>
							<p className='body-2 text-light-100'>Didn&apos;t receive OTP?</p>
							<Button
								type='button'
								variant='link'
								className='pl-1 text-brand-100'
								onClick={handleResendOTP}
							>
								Resend OTP
							</Button>
						</div>
					</div>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default OTPModal;
