import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/database/db.server.js';
import { usersTable } from '$lib/database/schema/auth-schema.js';
import { eq } from 'drizzle-orm';

import { lucia } from '$lib/server/auth.js';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signinFormSchema } from '@/zod-schema.js';

export const load = async () => {
	const form = await superValidate(zod(signinFormSchema));

	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signinFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const email = form.data.email;
		const password = form.data.password;

		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, email)
		});

		if (existingUser) {
			return setError(form, '', 'User with current e-mail already exists.');
		}

		const userId = generateId(25);
		const hashedPassword = await new Argon2id().hash(password);

		await db.insert(usersTable).values({
			id: userId,
			email,
			password: hashedPassword
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
