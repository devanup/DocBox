declare type FileType = 'document' | 'image' | 'video' | 'audio' | 'other';

declare interface UploadFileProps {
	file: File;
	ownerId: string;
	accountId: string;
	path: string;
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
