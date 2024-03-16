import { error, fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { newPasswordFormSchema } from '@/validations';
import { getExistingTokenRow, updateUserPassword } from '@/server/db-utils';
import {
	createSessionCookie,
	getHashedPassword,
	invalidateAllUserSessions,
	isValidExpirationDate
} from '@/server/auth-utils';

export const load = async ({ params }) => {
	const existingTokenRow = await getExistingTokenRow(params.tokenId);

	if (!existingTokenRow) {
		error(400, 'No valid token');
	}

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

		const existingTokenRow = await getExistingTokenRow(verificationToken);

		if (!existingTokenRow) {
			setError(form, 'password', 'No valid token');
		}

		const isExistingTokenValid = isValidExpirationDate(existingTokenRow.expiresAt);

		if (!isExistingTokenValid) {
			setError(form, 'password', 'Token expired');
		}

		const { userId } = existingTokenRow;

		const { password } = form.data;
		const hashedPassword = await getHashedPassword(password);

		const isTransactionSuccess = await updateUserPassword(userId, hashedPassword);

		if (!isTransactionSuccess) {
			error(500, 'Internal server error');
		}

		// invalidate user's sassion
		await invalidateAllUserSessions(userId);

		// create new user's session
		const sessionCookie = await createSessionCookie(userId);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
