import { fail, redirect } from '@sveltejs/kit';

import { sendVerificationCodeEmail } from '@/server/resend-utils';

import { emailVerificationCodeTable, usersTable } from '@/database/schema/auth-schema';
import { db } from '@/database/db.server';
import { eq } from 'drizzle-orm';

import { lucia } from '@/server/auth';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { validationCodeFormSchema } from '@/zod-schema';

export const load = async ({ locals: { user } }) => {
	if (!user) redirect(302, '/');
	if (user && user.emailVerified) redirect(302, '/');

	const form = await superValidate(zod(validationCodeFormSchema));

	const { id, email } = user;

	// delete old verification code
	await db.delete(emailVerificationCodeTable).where(eq(emailVerificationCodeTable.userId, id));
	// generate new one and save to db
	const code = generateRandomString(6, alphabet('0-9'));
	await db.insert(emailVerificationCodeTable).values({
		code,
		userId: id,
		email,
		expiresAt: createDate(new TimeSpan(10, 'm'))
	});

	// send email with verification code
	(async () => {
		const { error } = await sendVerificationCodeEmail(email, code);
		if (error) console.log(error);
	})();

	return {
		title: 'Email Verification',
		form
	};
};

export const actions = {
	default: async ({ request, cookies, locals: { user } }) => {
		if (!user) redirect(302, '/');

		const { id } = user;

		const form = await superValidate(request, zod(validationCodeFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { code } = form.data;

		// find code-row in db
		const [databaseCodeRow] = await db
			.select()
			.from(emailVerificationCodeTable)
			.where(eq(emailVerificationCodeTable.userId, id));

		if (!databaseCodeRow || databaseCodeRow.code !== code) {
			return setError(form, 'code', 'Incorrect code');
		}

		// delete email verification code
		await db.delete(emailVerificationCodeTable).where(eq(emailVerificationCodeTable.userId, id));

		if (!isWithinExpirationDate(databaseCodeRow.expiresAt)) {
			return setError(form, 'code', 'Code expired');
		}

		// update field emailVerified to true
		await db.update(usersTable).set({ emailVerified: true }).where(eq(usersTable.id, id));

		// invalidate user's sassion
		await lucia.invalidateUserSessions(id);

		// create new user's session
		const session = await lucia.createSession(id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
