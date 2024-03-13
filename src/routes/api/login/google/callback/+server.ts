import { error, redirect } from '@sveltejs/kit';

import { createOAuthUser, getExistingUser, setOAuthUserEmailVerifiedTrue } from '@/server/db-utils';
import {
	createSessionCookie,
	generateRandomId,
	getGoogleAuthenticatedUser
} from '@/server/auth-utils';

import { OAuth2RequestError } from 'arctic';

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
			await createOAuthUser(userId, googleUser.email);

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
