import { error, type Cookies } from '@sveltejs/kit';

import { lucia, google } from '$lib/server/auth';

import { generateId } from 'lucia';
import { TimeSpan, createDate, isWithinExpirationDate, type TimeSpanUnit } from 'oslo';
import { Argon2id } from 'oslo/password';
import { alphabet, generateRandomString } from 'oslo/crypto';

export const createSessionCookie = async (userId: string, attrs = {}) => {
	const session = await lucia.createSession(userId, attrs);
	return lucia.createSessionCookie(session.id);
};

export const invalidateAllUserSessions = async (userId: string) =>
	await lucia.invalidateUserSessions(userId);

export const generateRandomId = (length = 32) => generateId(length);

export const getHashedPassword = async (password: string) => await new Argon2id().hash(password);

export const validatePassword = async (userPassword: string, inputFieldPassword: string) =>
	await new Argon2id().verify(userPassword, inputFieldPassword);

export const generateNumericCode = (length: number) =>
	generateRandomString(length, alphabet('0-9'));

export const getExpiresAtDate = (value: number, unit: TimeSpanUnit) =>
	createDate(new TimeSpan(value, unit));

export const isValidExpirationDate = (expirationDate: Date) =>
	isWithinExpirationDate(expirationDate);

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

interface GoogleUser {
	email: string;
}
