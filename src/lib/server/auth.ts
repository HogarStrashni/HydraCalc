import { dev } from '$app/environment';

import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

import { db } from '$lib/database/db.server';
import { sessionsTable, usersTable } from '$lib/database/schema';

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (att) => ({ email: att.email })
});

interface UserAttributes {
	email: string;
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: UserAttributes;
	}
}
