import { db } from '@/database/db.server';
import { usersTable } from '@/database/schema';

import { eq } from 'drizzle-orm';

import type { User } from '.';

export const createOAuthUser = async (id: string, email: string) => {
	await db.insert(usersTable).values({
		id,
		email,
		emailVerified: true
	});
};

export const setOAuthUserEmailVerifiedTrue = async (user: User) => {
	if (user?.emailVerified === false) {
		await db.update(usersTable).set({ emailVerified: true }).where(eq(usersTable.id, user.id));
	}
};
