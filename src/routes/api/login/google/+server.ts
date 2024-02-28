import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

import { google } from '$lib/server/auth';

import { generateCodeVerifier, generateState } from 'arctic';

export const GET = async ({ cookies }) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['email']
	});

	cookies.set('google_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10
	});

	cookies.set('google_oauth_code_verifier', codeVerifier, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10
	});

	redirect(302, url.toString());
};
