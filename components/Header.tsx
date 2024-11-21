import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import Search from './Search';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';

interface HeaderProps {
	userId: string;
	accountId: string;
}

const Header = ({ userId, accountId }: HeaderProps) => {
	return (
		<header className='header'>
			<Search />
			<div className='header-wrapper'>
				<FileUploader ownerId={userId} accountId={accountId} />
				<form
					action={async () => {
						'use server';
						await signOutUser();
					}}
				>
					<Button type='submit' className='sign-out-button'>
						<Image
							src='/icons/logout.svg'
							alt='logout'
							width={24}
							height={24}
							className='w-6'
						/>
					</Button>
				</form>
			</div>
		</header>
	);
};

export default Header;
