import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/database/db.server';
import { usersTable } from '$lib/database/schema/auth-schema';
import { eq } from 'drizzle-orm';

import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';

import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signinFormSchema } from '@/zod-schema';

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

		const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));

		if (!existingUser) {
			return setError(form, '', 'Incorrect username or password');
		}

		if (!existingUser.password) {
			return setError(form, '', 'Incorrect username or password');
		}

		const validPassword = await new Argon2id().verify(existingUser.password, password);

		if (!validPassword) {
			return setError(form, '', 'Incorrect username or password');
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
