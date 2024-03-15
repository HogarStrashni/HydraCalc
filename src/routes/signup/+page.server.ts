import { error, fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signinFormSchema } from '@/validations/auth-zod-schema';

import { createCredentialsUser, getExistingUser, setVerificationCode } from '@/server/db-utils';
import {
	createSessionCookie,
	generateNumericCode,
	generateRandomId,
	getExpiresAtDate,
	getHashedPassword
} from '@/server/auth-utils';
import { sendVerificationCodeEmail } from '@/server/mail-resend';
import { setRedirectUrl } from '@/utils/toasts';

export const load = async ({ locals: { user } }) => {
	if (user && user.emailVerified) {
		redirect(302, setRedirectUrl('verified'));
	}

	if (user && !user.emailVerified) {
		redirect(302, setRedirectUrl('unverified', '/email-verification'));
	}
	const form = await superValidate(zod(signinFormSchema));

	return {
		title: 'Sign Up',
		form
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signinFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		const existingUser = await getExistingUser(email);

		if (existingUser) {
			return setError(form, '', 'User with current e-mail already exists.');
		}

		const userId = generateRandomId(36);
		const hashedPassword = await getHashedPassword(password);

		await createCredentialsUser(userId, email, hashedPassword);

		const sessionCookie = await createSessionCookie(userId);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		const verificationCode = generateNumericCode(6);
		const expiresAt = getExpiresAtDate(15, 'm');

		const isTransactionSuccess = await setVerificationCode(
			userId,
			email,
			verificationCode,
			expiresAt
		);

		if (!isTransactionSuccess) {
			error(500, 'Internal server error');
		}

		const { error: err } = await sendVerificationCodeEmail(email, verificationCode);
		if (err) {
			error(500, err.message ?? 'Internal server error');
		}

		redirect(302, '/email-verification');
	}
};
