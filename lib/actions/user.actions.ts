// user server directive since we have to call on the server side. This will never be run on the client side to not expose the secret key
'use server';

import { createAdminClient, createSessionClient } from '../appwrite';
import { Query, ID } from 'node-appwrite';
import { appwriteConfig } from '../appwrite/config';
import { parseStringify } from '../utils';
import { cookies } from 'next/headers';
import { userAvatar } from '@/constants';
import { redirect } from 'next/navigation';
/* 
    Create account flow:
    - User enters full name, and email
    - Check if user already exists using the email (we'll use this to identify if we need to create a new user document or not)
    - Send OTP to user's email
    - This will send a secret key for creating a session
    - Create a new user document if the user is a new user
    - Return the user's accountId that will be used to complete the login process
    - Verify OTP and authenticate to login
*/

const getUserByEmail = async (email: string) => {
	const { databases } = await createAdminClient();

	const result = await databases.listDocuments(
		appwriteConfig.databaseId,
		appwriteConfig.usersCollectionId,
		[Query.equal('email', [email])],
	);

	return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
	console.error(message, error);
	throw error;
};

export const sendEmailOTP = async (email: string) => {
	const { account } = await createAdminClient();

	try {
		const session = await account.createEmailToken(ID.unique(), email);
		return session.userId;
	} catch (error) {
		handleError(error, 'Failed to send OTP');
	}
};

export const createAccount = async (fullName: string, email: string) => {
	const existingUser = await getUserByEmail(email);

	const accountId = await sendEmailOTP(email);

	if (!accountId) throw new Error('Failed to send OTP');

	if (!existingUser) {
		const { databases } = await createAdminClient();
		await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			ID.unique(),
			{
				fullName,
				email,
				avatar: userAvatar,
				accountId,
			},
		);
	}
	return parseStringify({ accountId }); // utility function from utils.ts
};

export const verifySecret = async (accountId: string, password: string) => {
	try {
		const { account } = await createAdminClient();
		const session = await account.createSession(accountId, password);

		// Add logging to debug
		console.log('Session created:', session.$id);

		(await cookies()).set('appwrite-session', session.secret, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict', // 'strict' can sometimes cause issues in production
		});
		return parseStringify({ sessionId: session.$id });
	} catch (error) {
		console.error('Session creation error:', error);
		handleError(error, 'Failed to verify OTP');
	}
};

export const getCurrentUser = async () => {
	try {
		const { databases, account } = await createSessionClient();
		const result = await account.get();

		// If we can't get the account, redirect to sign-in
		if (!result) return null;

		const user = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			[Query.equal('accountId', result.$id)],
		);

		if (user.total <= 0) return null;

		// If we have a user, return the user
		return parseStringify(user.documents[0]);
	} catch (error) {
		// If there's any error (including authentication errors), return null
		console.error('Error getting current user:', error);
		return null;
	}
};

export const signOutUser = async () => {
	const { account } = await createSessionClient();
	try {
		// Delete the current session
		await account.deleteSession('current');
		(await cookies()).delete('appwrite-session');
	} catch (error) {
		handleError(error, 'Failed to sign out');
	} finally {
		redirect('/sign-in');
	}
};

export const signInUser = async (email: string) => {
	try {
		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			await sendEmailOTP(email);
			return parseStringify({ accountId: existingUser.accountId });
		}

		return parseStringify({ accountId: null, error: 'User not found' });
	} catch (error) {
		handleError(error, 'Failed to sign in');
	}
};
