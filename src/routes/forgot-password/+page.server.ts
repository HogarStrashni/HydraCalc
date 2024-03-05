import { fail, redirect } from '@sveltejs/kit';

import { sendResetPasswordEmail } from '@/server/resend-utils.js';

import { passwordResetTokenTable, usersTable } from '@/database/schema/auth-schema.js';
import { db } from '@/database/db.server.js';
import { eq } from 'drizzle-orm';

import { generateId } from 'lucia';
import { TimeSpan, createDate } from 'oslo';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordFormSchema } from '@/zod-schema.js';

export const load = async () => {
	const form = await superValidate(zod(resetPasswordFormSchema));

	return {
		title: 'Forgot password',
		form
	};
};

export const actions = {
	default: async ({ request, url }) => {
		const form = await superValidate(request, zod(resetPasswordFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const email = form.data.email;

		const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

		if (!user) {
			return setError(form, 'email', 'Email not found');
		}

		// delete all existing tokens from certain user
		await db.delete(passwordResetTokenTable).where(eq(passwordResetTokenTable.email, email));

		const tokenId = generateId(40);

		await db.insert(passwordResetTokenTable).values({
			id: tokenId,
			userId: user.id,
			email,
			expiresAt: createDate(new TimeSpan(1, 'h'))
		});

		const pathName = url.origin + url.pathname;
		const verificationLink = pathName + `/${tokenId}`;

		// send email with verification code
		(async () => {
			const { error } = await sendResetPasswordEmail(email, verificationLink);
			if (error) console.log(error);
		})();

		redirect(302, '/');
	}
};
