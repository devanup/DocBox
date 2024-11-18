// user server directive since we have to call on the server side. This will never be run on the client side to not expose the secret key
'use server';

import { appwriteConfig } from './config';
import { cookies } from 'next/headers';
import { Client, Account, Databases, Storage, Avatars } from 'node-appwrite';

// will be used to initialize instances and services like databases, users, files, etc. ensuring everything is connected to the appwrite project
export const createSessionClient = async () => {
	const client = new Client()
		.setEndpoint(appwriteConfig.endPointUrl)
		.setProject(appwriteConfig.projectId);

	// get the session cookie from the cookies object
	const session = (await cookies()).get('appwrite-session');

	if (!session || !session.value) {
		throw new Error('No session');
	}

	client.setSession(session.value);

	// return the client instance with the account and databases services
	return {
		get account() {
			return new Account(client);
		},
		get databases() {
			return new Databases(client);
		},
	};
};

// will be used to carryout actions that require admin privileges like creating new users, updating user attributes, etc.
export const createAdminClient = async () => {
	const client = new Client()
		.setEndpoint(appwriteConfig.endPointUrl)
		.setProject(appwriteConfig.projectId)
		.setKey(appwriteConfig.secretKey); // .setKey not found

	// return the client instance with the account and databases services
	return {
		get account() {
			return new Account(client);
		},
		get databases() {
			return new Databases(client);
		},
		get storage() {
			return new Storage(client);
		},
		get avatars() {
			return new Avatars(client);
		},
	};
};
