import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Sidebar from '@/components/Sidebar';
import React from 'react';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
const Layout = async ({ children }: { children: React.ReactNode }) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

	return (
		<main className='flex h-screen'>
			<Sidebar
				fullName={currentUser.fullName}
				email={currentUser.email}
				avatar={currentUser.avatar}
			/>

			<section className='flex h-full flex-1 flex-col'>
				<MobileNavigation />
				<Header />
				<div className='main-content'>{children}</div>
			</section>
		</main>
	);
};

export default Layout;
