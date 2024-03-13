import { fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { validationCodeFormSchema } from '@/validations/auth-zod-schema';

import {
	createSessionCookie,
	invalidateAllUserSessions,
	isVerificationCodeValid
} from '@/server/auth-utils';
import {
	getExistingCodeRow,
	deleteExistingCodeRow,
	updateEmailVerifiedTrue
} from '@/server/db-utils';

export const load = async ({ locals: { user } }) => {
	if (!user) redirect(302, '/');
	if (user && user.emailVerified) redirect(302, '/');

	const form = await superValidate(zod(validationCodeFormSchema));

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

		const exisingCodeRow = await getExistingCodeRow(id);

		if (!exisingCodeRow || exisingCodeRow.code !== code) {
			return setError(form, 'code', 'Incorrect code');
		}

		// delete verification code
		await deleteExistingCodeRow(id);

		const isExistingCodeValid = isVerificationCodeValid(exisingCodeRow.expiresAt);

		if (!isExistingCodeValid) {
			return setError(form, 'code', 'Code expired');
		}

		// update field emailVerified to true
		await updateEmailVerifiedTrue(id);

		// invalidate user's sassion
		await invalidateAllUserSessions(id);

		// create new user's session
		const sessionCookie = await createSessionCookie(id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
