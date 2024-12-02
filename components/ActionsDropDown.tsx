'use client';

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionsDropdownItems } from '@/constants';
import { constructDownloadUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Models } from 'node-appwrite';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { renameFile } from '@/lib/file.actions';
import { usePathname } from 'next/navigation';

const ActionsDropDown = ({ file }: { file: Models.Document }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);
	const [name, setName] = useState(file.name);
	const [isLoading, setIsLoading] = useState(false);
	const path = usePathname();

	// close all modals if cancel is clicked
	const closeAllModals = () => {
		setIsModalOpen(false);
		setIsDropdownOpen(false);
		setAction(null);
		setName(file.name);
		// setEmails([]);
	};

	const handleAction = async () => {
		if (!action) return;
		setIsLoading(true);
		let success = false;
		const actions = {
			rename: () =>
				renameFile({
					fileId: file.$id,
					name,
					extension: file.extension,
					path,
				}),
			details: () => {},
			share: () => {},
			delete: () => {},
		};
		success = Boolean(await actions[action.value as keyof typeof actions]());
		if (success) {
			closeAllModals();
		}
		setIsLoading(false);
	};

	const renderDialogContent = () => {
		if (!action) return null;
		const { value, label } = action;
		return (
			<DialogContent className='shad-dialog button'>
				<DialogHeader className='flex flex-col gap-3'>
					<DialogTitle className='text-center text-light-100'>
						{label}
					</DialogTitle>
					{value === 'rename' && (
						<Input
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					)}
				</DialogHeader>
				{/* if the action is rename, share or delete, show the footer */}
				{['rename', 'share', 'delete'].includes(value) && (
					<DialogFooter className='flex flex-col md:flex-row gap-3 mt-2'>
						<Button className='modal-cancel-button' onClick={closeAllModals}>
							Cancel
						</Button>
						<Button
							className='modal-submit-button'
							disabled={isLoading}
							onClick={handleAction}
						>
							{isLoading ? (
								<Image
									src='/icons/loader.svg'
									alt='loader'
									width={24}
									height={24}
									className='animate-spin'
								/>
							) : (
								<p className='capitalize'>{value}</p>
							)}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		);
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger className='shad-no-focus'>
					<Image
						src='/icons/dots.svg'
						className='pointer-events-none'
						alt='dots'
						width={34}
						height={34}
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel className='max-w-[200px] truncate'>
						{file.name}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{actionsDropdownItems.map((actionItem) => (
						<DropdownMenuItem
							key={actionItem.value}
							className='shad-dropdown-item'
							onClick={() => {
								setAction(actionItem);
								if (
									['rename', 'share', 'delete', 'details'].includes(
										actionItem.value,
									)
								) {
									setIsModalOpen(true);
								}
							}}
						>
							{actionItem.value === 'download' ? (
								<Link
									href={constructDownloadUrl(file.bucketFileId)}
									download={file.name}
									className='flex items-center gap-2'
								>
									<Image
										src={actionItem.icon}
										alt={actionItem.label}
										width={30}
										height={30}
									/>
									{actionItem.label}
								</Link>
							) : (
								<div className='flex items-center gap-2'>
									<Image
										src={actionItem.icon}
										alt={actionItem.label}
										width={30}
										height={30}
									/>
									{actionItem.label}
								</div>
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{renderDialogContent()}
		</Dialog>
	);
};

export default ActionsDropDown;
