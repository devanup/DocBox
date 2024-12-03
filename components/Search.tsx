'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import { FormattedDateTime } from './FormattedDateTime';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';

const Search = () => {
	const [query, setQuery] = useState('');
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('query') || '';
	const [result, setResult] = useState<Models.Document[]>([]);
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const path = usePathname();
	const [debouncedQuery] = useDebounce(query, 300);

	useEffect(() => {
		const fetchFiles = async () => {
			// if no query, clear the result and close the search
			if (debouncedQuery.length === 0) {
				setResult([]);
				setOpen(false);
				return router.push(path.replace(searchParams.toString(), '')); // remove search params
			}
			const files = await getFiles({ types: [], searchText: debouncedQuery });
			setResult(files?.documents || []);
			setOpen(true);
		};
		fetchFiles();
	}, [debouncedQuery]);

	useEffect(() => {
		if (!searchQuery) {
			setQuery('');
		}
	}, [searchQuery]);

	const handleClickItem = (file: Models.Document) => {
		setOpen(false);
		setResult([]);

		router.push(
			`/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${query}`, // 's' for documents, images, others
		);
	};

	return (
		<div className='search'>
			<div className='search-input-wrapper'>
				<Image src='/icons/search.svg' alt='search' width={24} height={24} />
				<Input
					placeholder='Search'
					type='text'
					className='search-input'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				{open && (
					<ul className='search-result'>
						{result.length > 0 ? (
							result.map((file) => (
								<li
									key={file.$id}
									className='flex items-center justify-between'
									onClick={() => handleClickItem(file)}
								>
									<div className='flex cursor-pointer items-center gap-4'>
										<Thumbnail
											type={file.type}
											extension={file.extension}
											url={file.url}
											className='size-9 min-w-9'
										/>
										<p className='subtitle-2 line-clamp-1 text-light-100'>
											{file.name}
										</p>
									</div>
									<FormattedDateTime
										date={file.$createdAt}
										className='caption line-clamp-1 text-light-200'
									/>
								</li>
							))
						) : (
							<p className='empty-result'>No results found</p>
						)}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Search;
