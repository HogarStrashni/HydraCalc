import { db } from '@/database/db.server';
import { emailVerificationCodeTable, passwordResetTokenTable, usersTable } from '@/database/schema';

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

export const createCredentialsUser = async (id: string, email: string, password: string) => {
	await db.insert(usersTable).values({
		id,
		email,
		emailVerified: false,
		password
	});
};

export const deleteExistingCodeRow = async (userId: string) =>
	await db.delete(emailVerificationCodeTable).where(eq(emailVerificationCodeTable.userId, userId));

export const updateEmailVerifiedTrue = async (userId: string) =>
	await db.update(usersTable).set({ emailVerified: true }).where(eq(usersTable.id, userId));

// set verification code db transaction
export const setVerificationCode = async (
	id: string,
	email: string,
	code: string,
	expiresAt: Date
) => {
	await db.transaction(async (tx) => {
		// delete old verification code
		await tx.delete(emailVerificationCodeTable).where(eq(emailVerificationCodeTable.userId, id));
		// generate new one and save to db
		await tx.insert(emailVerificationCodeTable).values({
			userId: id,
			email,
			code,
			expiresAt
		});
	});
	return true;
};

// set password reset token db transaction
export const setPasswordResetToken = async (
	tokenId: string,
	userId: string,
	email: string,
	expiresAt: Date
) => {
	await db.transaction(async (tx) => {
		// delete old password reset token
		await tx.delete(passwordResetTokenTable).where(eq(passwordResetTokenTable.email, email));
		// generate new one and save to db
		await tx.insert(passwordResetTokenTable).values({
			id: tokenId,
			userId,
			email,
			expiresAt
		});
	});
	return true;
};
