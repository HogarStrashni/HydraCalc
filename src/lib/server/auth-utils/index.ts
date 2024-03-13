import { error, type Cookies } from '@sveltejs/kit';

import { lucia, google } from '$lib/server/auth';
import { OAuth2RequestError } from 'arctic';

import { generateId } from 'lucia';

interface GoogleUser {
	email: string;
}

// Get User after success google authentication
export const getGoogleAuthenticatedUser = async (url: URL, cookies: Cookies) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state');
	const storedCodeVerifier = cookies.get('google_oauth_code_verifier');

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		error(400, 'Bad request');
	}

	const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

	const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken}`
		}
	});

	return (await response.json()) as GoogleUser;
};

export const createSessionCookie = async (id: string, attrs = {}) => {
	const session = await lucia.createSession(id, attrs);
	return lucia.createSessionCookie(session.id);
};

export const generateUserId = (length = 32) => {
	return generateId(length);
};
