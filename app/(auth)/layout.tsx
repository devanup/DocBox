import Image from 'next/image';
import React from 'react';
import { Nabla } from 'next/font/google';

const nabla = Nabla({
	weight: '400',
	subsets: ['latin'],
});

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex min-h-screen'>
			<section className='bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5'>
				<div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>
					<div className='flex items-center space-x-2 mb-10'>
						<Image
							src='/icons/logo-icon-light.png'
							alt='logo'
							width={60}
							height={60}
							className='pointer-events-none'
						/>
						<span className={`${nabla.className} text-3xl`}>DocBox</span>
					</div>
					<div className='space-y-3 text-white'>
						<h1 className='h1'>Your Complete Cloud Storage Solution</h1>
						<p className='body-1 text-gray-300'>
							Your files, your rules, available anywhere, anytime
							{/* DocBox is a platform that allows you to manage your files in the
							best way possible. */}
						</p>
						<Image
							src='/images/cloud-storage.png'
							alt='cloud-storage'
							className='!mt-10 pointer-events-none'
							width={342}
							height={342}
						/>
					</div>
				</div>
			</section>
			<section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
				<div className='mb-16 lg:hidden'>
					<div className='flex items-center space-x-2 mb-10'>
						<Image
							src='/icons/logo-icon-light.png'
							alt='logo'
							width={60}
							height={60}
							className='h-auto w-[70px] lg:w-[120px]'
						/>
						<span className={`${nabla.className} text-3xl`}>DocBox</span>
					</div>
				</div>
				{children}
			</section>
		</div>
	);
};

export default Layout;
