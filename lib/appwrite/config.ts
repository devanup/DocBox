export const appwriteConfig = {
	endPointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!, // exclamation mark is used to ensure that the environment variable is not undefined
	projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
	databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
	usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
	filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
	bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
	secretKey: process.env.NEXT_APPWRITE_KEY!, // only available for the backend server actions
};
