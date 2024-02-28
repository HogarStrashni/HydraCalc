import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/database/db.server.js';
import { usersTable } from '$lib/database/schema/auth-schema.js';

import { lucia } from '$lib/server/auth.js';
import { Argon2id } from 'oslo/password';

import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, email)
		});

		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		if (!existingUser.password) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await new Argon2id().verify(existingUser.password, password);

		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
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
