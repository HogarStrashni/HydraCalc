import { redirect } from '@sveltejs/kit';
import { db } from '$lib/database/db.server.js';
import { usersTable } from '$lib/database/schema/auth-schema.js';

import { lucia } from '$lib/server/auth.js';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

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
