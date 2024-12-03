declare type FileType = 'document' | 'image' | 'video' | 'audio' | 'other';

declare interface SearchParamProps {
	params?: Promise<SegmentParams>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface UploadFileProps {
	file: File;
	ownerId: string;
	accountId: string;
	path: string;
}

declare interface GetFilesProps {
	types: FileType[];
	searchText?: string;
	sort?: string;
	limit?: number;
}

declare interface ActionType {
	label: string;
	icon: string;
	value: string;
}

declare interface RenameFileProps {
	fileId: string;
	name: string;
	extension: string;
	path: string;
}

declare interface UpdateFileUsersProps {
	fileId: string;
	emails: string[];
	path: string;
}

declare interface DeleteFileProps {
	fileId: string;
	bucketFileId: string;
	path: string;
}
