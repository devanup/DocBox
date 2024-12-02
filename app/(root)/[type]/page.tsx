import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/file.actions';
import { Models } from 'node-appwrite';
import React from 'react';

interface SearchParamProps {
	params: {
		type: string;
	};
}

const Page = async ({ params }: SearchParamProps) => {
	// const type = ((await params)?.type as string) || '';
	const type = params.type || '';
	const files = await getFiles();

	return (
		<div className='page-container'>
			<section className='w-full'>
				<h1 className='h1 capitalize'>{type}</h1>
				<div className='total-size-section'>
					<p className='body-1'>
						Total: <span className='h5'>0 MB</span>
					</p>
					<div className='sort-container'>
						<p className='body-1 hidden md:block text-light-200'>Sort by:</p>
						<Sort />
					</div>
				</div>
			</section>
			{/* Render the files */}
			{files && files.total > 0 ? (
				<section className='file-list'>
					{files.documents.map((file: Models.Document) => (
						<Card key={file.$id} file={file} />
					))}
				</section>
			) : (
				<p className='empty-list'>No files found</p>
			)}
		</div>
	);
};

export default Page;
