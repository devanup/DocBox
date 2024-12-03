import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Sidebar from '@/components/Sidebar';
import React from 'react';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

export const dynamic = 'force-dynamic'; // static pages are pre-rendered at build time, and cannot use runtime specific features like cookies so we need to force dynamic rendering for pages that are not static which makes the page render on the server for every request

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
				<MobileNavigation
					ownerId={currentUser.$id}
					accountId={currentUser.$collectionId}
					fullName={currentUser.fullName}
					avatar={currentUser.avatar}
					email={currentUser.email}
				/>
				<Header userId={currentUser.$id} accountId={currentUser.accountId} />
				<div className='main-content'>{children}</div>
			</section>
			<Toaster />
		</main>
	);
};

export default Layout;
