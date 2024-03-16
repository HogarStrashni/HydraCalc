import { error, redirect } from '@sveltejs/kit';

import { OAuth2RequestError } from 'arctic';

import { createOAuthUser, getExistingUser, setOAuthUserEmailVerifiedTrue } from '@/server/db-utils';
import {
	createSessionCookie,
	generateRandomId,
	getGoogleAuthenticatedUser,
	getHashedPassword
} from '@/server/auth-utils';

export const GET = async ({ url, cookies }) => {
	try {
		const googleUser = await getGoogleAuthenticatedUser(url, cookies);

		const existingUser = await getExistingUser(googleUser.email);

		if (existingUser) {
			await setOAuthUserEmailVerifiedTrue(existingUser);
			const sessionCookie = await createSessionCookie(existingUser.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateRandomId(36);
			// create random strong password to standardize the auth flow
			const password = generateRandomId(24);
			const hashedPassword = await getHashedPassword(password);

			await createOAuthUser(userId, googleUser.email, hashedPassword);

			const sessionCookie = await createSessionCookie(userId);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
	} catch (err) {
		console.error(err);
		if (err instanceof OAuth2RequestError) {
			error(400, err.message ?? 'Bad request');
		}
		error(500, 'Internal server error');
	}

	redirect(302, '/');
};
