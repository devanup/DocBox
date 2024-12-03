'use server';

import { createAdminClient, createSessionClient } from '../appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '../appwrite/config';
import { ID, Models, Query } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from '../utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './user.actions';

const handleError = (error: unknown, message: string) => {
	console.error(message, error);
	throw error;
};

export const uploadFile = async ({
	file,
	ownerId,
	accountId,
	path,
}: UploadFileProps) => {
	// access the appwrite storage and database
	const { storage, databases } = await createAdminClient();

	try {
		// convert the file to an input file. It takes the file and converts it to a buffer and then it takes the buffer and converts it to an input file
		const inputFile = InputFile.fromBuffer(file, file.name);
		const bucketFile = await storage.createFile(
			appwriteConfig.bucketId,
			ID.unique(),
			inputFile,
		);

		// be very precise about the information of the file
		const fileDocument = {
			type: getFileType(bucketFile.name).type,
			name: bucketFile.name,
			url: constructFileUrl(bucketFile.$id),
			extension: getFileType(bucketFile.name).extension,
			size: bucketFile.sizeOriginal,
			owner: ownerId,
			accountId: accountId,
			users: [],
			bucketFileId: bucketFile.$id,
		};

		const newFile = await databases
			.createDocument(
				appwriteConfig.databaseId,
				appwriteConfig.filesCollectionId,
				ID.unique(),
				fileDocument,
			)
			.catch(async (error: unknown) => {
				// if something goes wrong when we try to create the file document, we shouldn't leave the file in the storage bucket
				await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
				handleError(error, 'Failed to upload file');
			});
		revalidatePath(path);

		return parseStringify(newFile);
	} catch (error) {
		handleError(error, 'Failed to upload file');
	}
};

/*
	We pass the file through prop, then we read it from the buffer then turn it into an input file, then we call the createFile function from the storage class. We specify the bucketId (where we're uploading the file) and the unique ID for the file. Then we pass the input file to the createFile function.
    Then we create fileDocument that contains the information about the file because we want to store the file information / metadata in the database which we can use to display the file information in the UI.
    To store the file itself we're using the storage class by appwrite, and to store the file information / metadata we're using the database class by appwrite. We also use the revalidatePath function to revalidate the path so that the new file is displayed in the UI.
*/

const createQueries = (
	currentUser: Models.Document,
	types: string[],
	searchText: string,
	sort: string,
	limit?: number,
) => {
	const queries = [
		Query.or([
			Query.equal('owner', currentUser.$id),
			Query.contains('users', currentUser.email),
		]),
	];

	if (types.length > 0) {
		queries.push(Query.equal('type', types));
	}

	if (searchText) {
		queries.push(Query.contains('name', searchText));
	}

	if (sort) {
		const [sortBy, orderBy] = sort.split('-'); // 'createdAt-desc'
		queries.push(
			orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
		);
	}

	if (limit) {
		queries.push(Query.limit(limit));
	}

	return queries;
};

export const getFiles = async ({
	types = [],
	searchText = '',
	sort = '$createdAt-desc',
	limit,
}: GetFilesProps) => {
	const { databases } = await createAdminClient();

	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			throw new Error('User not found');
		}
		const queries = createQueries(currentUser, types, searchText, sort, limit);

		const files = await databases.listDocuments(
			appwriteConfig.databaseId, // which database we want to access
			appwriteConfig.filesCollectionId, // which collection we want to access
			queries, // the queries we want to run
		);

		return parseStringify(files);
	} catch (error) {
		handleError(error, 'Failed to get files');
	}
};

export const renameFile = async ({
	fileId,
	name,
	extension,
	path,
}: RenameFileProps) => {
	const { databases } = await createAdminClient();

	try {
		const newName = `${name}.${extension}`;
		// Update file metadata in database only, actual file remains in storage
		const updatedFile = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
			{
				name: newName,
			},
		);

		revalidatePath(path);
		return parseStringify(updatedFile);
	} catch (error) {
		handleError(error, 'Failed to rename file');
	}
};

export const updateFileUsers = async ({
	fileId,
	emails,
	path,
}: UpdateFileUsersProps) => {
	const { databases } = await createAdminClient();

	try {
		// Update file metadata in database only, actual file remains in storage
		const updatedFile = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
			{
				users: emails,
			},
		);

		revalidatePath(path);
		return parseStringify(updatedFile);
	} catch (error) {
		handleError(error, 'Failed to update file users');
	}
};

export const deleteFile = async ({
	fileId,
	bucketFileId,
	path,
}: DeleteFileProps) => {
	const { databases, storage } = await createAdminClient();

	try {
		const deletedFile = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
		);
		if (deletedFile) {
			await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
		}
		revalidatePath(path);
		return parseStringify('success');
	} catch (error) {
		handleError(error, 'Failed to delete file');
	}
};

// ============================== TOTAL FILE SPACE USED
export async function getTotalSpaceUsed() {
	try {
		const { databases } = await createSessionClient();
		const currentUser = await getCurrentUser();
		if (!currentUser) throw new Error('User is not authenticated.');

		const files = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			[Query.equal('owner', [currentUser.$id])],
		);

		const totalSpace = {
			image: { size: 0, latestDate: '' },
			document: { size: 0, latestDate: '' },
			video: { size: 0, latestDate: '' },
			audio: { size: 0, latestDate: '' },
			other: { size: 0, latestDate: '' },
			used: 0,
			all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
		};

		files.documents.forEach((file) => {
			const fileType = file.type as FileType;
			totalSpace[fileType].size += file.size;
			totalSpace.used += file.size;

			if (
				!totalSpace[fileType].latestDate ||
				new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
			) {
				totalSpace[fileType].latestDate = file.$updatedAt;
			}
		});

		return parseStringify(totalSpace);
	} catch (error) {
		handleError(error, 'Error calculating total space used:, ');
	}
}
