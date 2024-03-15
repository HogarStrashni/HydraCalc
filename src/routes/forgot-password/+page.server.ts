import { error, fail, redirect } from '@sveltejs/kit';

import { sendResetPasswordEmail } from '@/server/mail-resend';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordFormSchema } from '@/validations';

import { getExistingUser, setPasswordResetToken } from '@/server/db-utils';
import { generateRandomId, getExpiresAtDate } from '@/server/auth-utils';

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

		const { email } = form.data;

		const existingUser = await getExistingUser(email);

		if (!existingUser) {
			return setError(form, 'email', 'Email not found');
		}

		const tokenId = generateRandomId(40);
		const { id } = existingUser;
		const expiresAt = getExpiresAtDate(1, 'h');

		const isTransactionSuccess = await setPasswordResetToken(tokenId, id, email, expiresAt);

		if (!isTransactionSuccess) {
			error(500, 'Internal server error');
		}

		const pathName = url.origin + url.pathname;
		const verificationLink = pathName + `/${tokenId}`;

		const { error: err } = await sendResetPasswordEmail(email, verificationLink);
		if (err) {
			error(500, err.message ?? 'Internal server error');
		}

		redirect(302, '/');
	}
};
