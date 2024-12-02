'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { cn, convertFileToUrl } from '@/lib/utils';
import Image from 'next/image';
import { getFileType } from '@/lib/utils';
import Thumbnail from './Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/file.actions';
import { usePathname } from 'next/navigation';

interface FileUploaderProps {
	ownerId: string;
	accountId: string;
	// className?: string;
}

const FileUploader = ({ ownerId, accountId }: FileUploaderProps) => {
	const path = usePathname();
	const [files, setFiles] = useState<File[]>([]);
	const { toast } = useToast();

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			// Do something with the files
			setFiles(acceptedFiles);
			// upload the files to the database
			const uploadPromises = acceptedFiles.map(async (file) => {
				if (file.size > MAX_FILE_SIZE) {
					// if the file is larger than the max file size 50mb, we remove it from the files array
					setFiles((prevFiles) =>
						prevFiles.filter((f) => f.name !== file.name),
					);
					return toast({
						description: (
							<p className='body-2 text-white'>
								<span className='font-semibold'>{file.name}</span> exceeds the
								maximum allowed size of 50MB. Please select a smaller file.
							</p>
						),
						className: 'error-toast',
					});
				}
				return uploadFile({ file, ownerId, accountId, path }).then(
					(uploadedFile) => {
						if (uploadedFile) {
							// remove the file from the files array after it has been uploaded
							setFiles((prevFiles) =>
								prevFiles.filter((f) => f.name !== file.name),
							);
						}
					},
				);
			});

			// wait for all the upload promises to resolve
			await Promise.all(uploadPromises);
		},
		// don't re-run the onDrop function if the ownerId, accountId, or path changes
		[ownerId, accountId, path],
	);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const handleRemoveFile = (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>,
		fileName: string,
	) => {
		e.stopPropagation();
		// remove the file from the files array
		setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
	};

	return (
		<div {...getRootProps()} className='cursor-pointer'>
			<input {...getInputProps()} />
			<Button type='button' className={cn('uploader-button')}>
				<Image
					src='/icons/upload.svg'
					alt='upload'
					width={24}
					height={24}
					className='pointer-events-none'
				/>
				<p>Upload</p>
			</Button>
			{files.length > 0 && (
				<ul className='uploader-preview-list'>
					<h4 className='h4 text-light-100 animate-pulse'>Uploading...</h4>
					{files.map((file, index) => {
						// figure out the file type
						const { type, extension } = getFileType(file.name);

						return (
							<li
								key={`${file.name}-${index}`}
								className='uploader-preview-item'
							>
								<div className='flex items-center gap-3'>
									<Thumbnail
										type={type}
										extension={extension}
										url={convertFileToUrl(file)}
									/>
									<div className='preview-item-name'>
										{file.name}
										{/* <Image
											src='/icons/file-loader.gif'
											width={80}
											height={26}
											alt='Loader'
										/> */}
									</div>
								</div>
								<Image
									src='/icons/remove.svg'
									alt='remove'
									width={24}
									height={24}
									onClick={(e) => handleRemoveFile(e, file.name)}
								/>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default FileUploader;
