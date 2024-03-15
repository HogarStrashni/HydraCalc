import { error, fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { validationCodeFormSchema } from '@/validations';

import {
	createSessionCookie,
	generateNumericCode,
	getExpiresAtDate,
	invalidateAllUserSessions,
	isValidExpirationDate
} from '@/server/auth-utils';
import {
	getExistingCodeRow,
	deleteExistingCodeRow,
	updateEmailVerifiedTrue,
	setVerificationCode
} from '@/server/db-utils';

import { sendVerificationCodeEmail } from '@/server/mail-resend';
import { setRedirectUrl } from '@/utils/toasts';
import { createRateLimiter } from '@/server/rate-limiter';

const codeRateLimiter = createRateLimiter(5, 'verification-code-limiter');

export const load = async (event) => {
	await codeRateLimiter.cookieLimiter?.preflight(event);

	const {
		locals: { user }
	} = event;

	if (!user) redirect(302, setRedirectUrl('unauthenticated'));
	if (user && user.emailVerified) redirect(302, setRedirectUrl('verified'));

	const form = await superValidate(zod(validationCodeFormSchema), {
		id: 'verify-email'
	});

	return {
		title: 'Email Verification',
		form
	};
};

export const actions = {
	verification: async (event) => {
		if (await codeRateLimiter.isLimited(event)) {
			error(429, 'You are being rate limited. Try again later!');
		}

		const {
			request,
			cookies,
			locals: { user }
		} = event;

		if (!user) redirect(302, '/');
		const { id } = user;

		const form = await superValidate(request, zod(validationCodeFormSchema), {
			id: 'verify-email'
		});

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

		const isExistingCodeValid = isValidExpirationDate(exisingCodeRow.expiresAt);

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
	},

	'new-code': async (event) => {
		if (await codeRateLimiter.isLimited(event)) {
			error(429, 'You are being rate limited. Try again later!');
		}

		const {
			locals: { user }
		} = event;

		if (!user) redirect(302, '/');
		const { id, email } = user;

		const verificationCode = generateNumericCode(6);
		const expiresAt = getExpiresAtDate(15, 'm');

		const isTransactionSuccess = await setVerificationCode(id, email, verificationCode, expiresAt);

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
