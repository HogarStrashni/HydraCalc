import { redirect } from '@sveltejs/kit';

import { sendVerificationCodeEmail } from '@/server/resend-utils';

import { emailVerificationCode, usersTable } from '@/database/schema/auth-schema';
import { db } from '@/database/db.server';
import { eq } from 'drizzle-orm';

import { lucia } from '@/server/auth.js';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { validationCodeSchema } from '@/zod-schema.js';

export const load = async ({ locals: { user } }) => {
	if (!user) redirect(302, '/');
	if (user && user.emailVerified) redirect(302, '/');

	const form = await superValidate(zod(validationCodeSchema));

	const { id, email } = user;

	// delete old verification code
	await db.delete(emailVerificationCode).where(eq(emailVerificationCode.userId, id));
	// generate new one and save to db
	const code = generateRandomString(6, alphabet('0-9'));
	await db.insert(emailVerificationCode).values({
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

		const form = await superValidate(request, zod(validationCodeSchema));

		const code = form.data.code;

		// find code-row in db
		const [dataBaseCodeRow] = await db
			.select()
			.from(emailVerificationCode)
			.where(eq(emailVerificationCode.userId, id));

		if (!dataBaseCodeRow || dataBaseCodeRow.code !== code) {
			return setError(form, 'code', 'Incorrect code');
		}

		// delete email verification code
		await db.delete(emailVerificationCode).where(eq(emailVerificationCode.userId, id));

		if (!isWithinExpirationDate(dataBaseCodeRow.expiresAt)) {
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
