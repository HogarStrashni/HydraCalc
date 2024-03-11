import { fail, redirect } from '@sveltejs/kit';

import { passwordResetTokenTable, usersTable } from '@/database/schema/auth-schema';
import { db } from '@/database/db.server';
import { eq } from 'drizzle-orm';

import { lucia } from '@/server/auth';
import { Argon2id } from 'oslo/password';
import { isWithinExpirationDate } from 'oslo';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newPasswordFormSchema } from '@/validations/auth-zod-schema';

export const load = async () => {
	const form = await superValidate(zod(newPasswordFormSchema));

	return {
		title: 'Reset password',
		form
	};
};

export const actions = {
	default: async ({ request, cookies, params }) => {
		const form = await superValidate(request, zod(newPasswordFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const verificationToken = params.tokenId;

		const [databaseToken] = await db
			.select()
			.from(passwordResetTokenTable)
			.where(eq(passwordResetTokenTable.id, verificationToken));

		if (!databaseToken || isWithinExpirationDate(databaseToken.expiresAt)) {
			setError(form, 'password', 'Token expired');
		}

		const userId = databaseToken.userId;

		await db
			.delete(passwordResetTokenTable)
			.where(eq(passwordResetTokenTable.id, verificationToken));

		const password = form.data.password;

		await lucia.invalidateUserSessions(userId);
		const hashedPassword = await new Argon2id().hash(password);
		await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, userId));

		// create new user's session
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
