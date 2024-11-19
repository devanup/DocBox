'use client';

import React, { useState } from 'react';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';

interface Props {
	ownerId: string;
	accountId: string;
	fullName: string;
	avatar: string;
	email: string;
}

const MobileNavigation = ({
	// ownerId,
	// accountId,
	fullName,
	avatar,
	email,
}: Props) => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<header className='mobile-header'>
			<Link href='/' className='header-wrapper'>
				<Image
					src='/icons/logo-icon-light.png'
					alt='logo'
					width={50}
					height={52}
					className='h-auto object-contain'
				/>
				<span className='text-xl font-bold'>DocBox</span>
			</Link>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger>
					<Image src='/icons/menu.svg' alt='menu' width={30} height={30} />
				</SheetTrigger>
				<SheetContent className='shad-sheet h-screen px-3'>
					<SheetTitle>
						<div className='header-user'>
							<Image
								src={avatar}
								alt='avatar'
								width={44}
								height={44}
								className='header-user-avatar'
							/>
							<div className='sm:hidden lg:block'>
								<p className='subtitle-2 capitalize'>{fullName}</p>
								<p className='caption'>{email}</p>
							</div>
						</div>
					</SheetTitle>
					<Separator className='my-5 bg-light-200/40' />
					<nav className='mobile-nav'>
						<ul className='mobile-nav-list'>
							{navItems.map(({ url, label, icon }) => (
								<Link key={label} href={url} className='lg:w-full'>
									<li
										className={cn(
											'mobile-nav-item',
											pathname === url && 'shad-active',
										)}
									>
										<Image
											src={icon}
											alt={label}
											width={24}
											height={24}
											className={cn(
												'nav-icon',
												pathname === url && 'nav-icon-active',
											)}
										/>
										<p>{label}</p>
									</li>
								</Link>
							))}
						</ul>
					</nav>
					<Separator className='my-5 bg-light-200/40' />

					<div className='flex flex-col justify-between gap-5 pb-5'>
						<FileUploader />
						<Button
							type='submit'
							className='mobile-sign-out-button'
							onClick={async () => {
								await signOutUser();
							}}
						>
							<Image
								src='/icons/logout.svg'
								alt='logout'
								width={24}
								height={24}
							/>
							<p>Sign Out</p>
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</header>
	);
};

export default MobileNavigation;
