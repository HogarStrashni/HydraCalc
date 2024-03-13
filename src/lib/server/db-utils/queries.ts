import { db } from '@/database/db.server';
import { emailVerificationCodeTable, passwordResetTokenTable, usersTable } from '@/database/schema';

import { eq } from 'drizzle-orm';

export const getExistingUser = async (email: string) => {
	const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));
	return existingUser;
};
export type User = Awaited<ReturnType<typeof getExistingUser>>;

export const getExistingCodeRow = async (userId: string) => {
	const [existingCodeRow] = await db
		.select()
		.from(emailVerificationCodeTable)
		.where(eq(emailVerificationCodeTable.userId, userId));
	return existingCodeRow;
};

export const getExistingTokenRow = async (token: string) => {
	const [existingTokenRow] = await db
		.select()
		.from(passwordResetTokenTable)
		.where(eq(passwordResetTokenTable.id, token));
	return existingTokenRow;
};
