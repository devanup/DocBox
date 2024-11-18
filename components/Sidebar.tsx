'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { navItems } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Props {
	fullName: string;
	email: string;
	avatar: string;
}

const Sidebar = ({ fullName, email, avatar }: Props) => {
	const pathname = usePathname();
	return (
		<aside className='sidebar'>
			<Link href='/' className='flex items-center space-x-2 mb-10 w-fit'>
				<Image
					src='/icons/logo-icon-light.png'
					alt='logo'
					width={50}
					height={50}
					className='hidden h-auto lg:block pointer-events-none'
				/>
				<span className='text-2xl lg:block hidden'>DocBox</span>

				<Image
					src='/icons/logo-icon-light.png'
					alt='mobile-logo'
					width={50}
					height={50}
					className='lg:hidden pointer-events-none'
				/>
			</Link>

			<nav className='sidebar-nav'>
				<ul className='flex flex-1 flex-col gap-6'>
					{navItems.map(({ url, label, icon }) => (
						<Link key={label} href={url} className='lg:w-full'>
							<li
								className={cn(
									'sidebar-nav-item',
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
								<p className='hidden lg:block'>{label}</p>
							</li>
						</Link>
					))}
				</ul>
			</nav>

			<Image
				src='/images/files-2.png'
				alt='illustration'
				width={506}
				height={418}
				className='w-full'
			/>
			<div className='sidebar-user-info'>
				<Image
					src={avatar}
					alt='user'
					width={44}
					height={44}
					className='sidebar-user-avatar pointer-events-none'
				/>
				<div className='hidden lg:block'>
					<p className='subtitle-2 capitalize'>{fullName}</p>
					<p className='caption'>{email}</p>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
