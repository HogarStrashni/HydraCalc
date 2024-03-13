import { fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signinFormSchema } from '@/validations/auth-zod-schema';

import { createCredentialsUser, getExistingUser } from '@/server/db-utils';
import { createSessionCookie, generateRandomId, getHashedPassword } from '@/server/auth-utils';

export const load = async () => {
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

		redirect(302, '/email-verification');
	}
};
