import { fail, redirect } from '@sveltejs/kit';

import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signinFormSchema } from '@/validations/auth-zod-schema';

import { getExistingUser } from '@/server/db-utils';
import { createSessionCookie, validatePassword } from '@/server/auth-utils';

export const load = async () => {
	const form = await superValidate(zod(signinFormSchema));

	return {
		title: 'Sign In',
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

		if (!existingUser) {
			return setError(form, '', 'Incorrect username or password');
		}

		if (!existingUser.password) {
			return setError(form, '', 'Incorrect username or password');
		}

		const isPasswordValid = await validatePassword(existingUser.password, password);

		if (!isPasswordValid) {
			return setError(form, '', 'Incorrect username or password');
		}

		const sessionCookie = await createSessionCookie(existingUser.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
