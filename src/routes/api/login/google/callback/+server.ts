import { db } from '$lib/database/db.server.js';
import { usersTable } from '$lib/database/schema/auth-schema.js';

import { google, lucia } from '$lib/server/auth.js';
import { generateId } from 'lucia';
import { OAuth2RequestError } from 'arctic';

import { eq } from 'drizzle-orm';

export const GET = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const storedState = cookies.get('google_oauth_state');
	const storedCodeVerifier = cookies.get('google_oauth_code_verifier');

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response(null, {
			status: 400,
			statusText: 'Bad Request'
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

		const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser = (await response.json()) as GoogleUser;

		const [existingUser] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, googleUser.email));

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(25);

			await db.insert(usersTable).values({
				id: userId,
				email: googleUser.email,
				emailVerified: true
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		if (existingUser?.emailVerified === false) {
			await db
				.update(usersTable)
				.set({ emailVerified: true })
				.where(eq(usersTable.id, existingUser.id));
		}

		return new Response(null, {
			status: 303,
			headers: {
				Location: '/'
			}
		});
	} catch (err) {
		console.error(err);
		if (err instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};

interface GoogleUser {
	email: string;
}
