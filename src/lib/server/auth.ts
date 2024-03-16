import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } from '$env/static/private';
import { dev } from '$app/environment';

import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { Google } from 'arctic';

import { db } from '$lib/database/db.server';
import { sessionsTable, usersTable } from '$lib/database/schema';

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (att) => ({ email: att.email, emailVerified: att.emailVerified })
});

// GOOGLE OAUTH
const REDIRECT_URI = dev
	? 'http://localhost:5173/api/login/google/callback'
	: `${BASE_URL}/api/login/google/callback`;

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

interface UserAttributes {
	email: string;
	emailVerified: boolean;
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: UserAttributes;
	}
}
