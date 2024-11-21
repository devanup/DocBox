'use server';

import { UploadFileProps } from '@/types';
import { createAdminClient } from './appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from './appwrite/config';
import { ID } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from './utils';
import { revalidatePath } from 'next/cache';

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
