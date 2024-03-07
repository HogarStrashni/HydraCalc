import { lucia } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, locals: { session } }) => {
	if (!session) {
		error(400, 'Bad request');
	}

	await lucia.invalidateSession(session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	redirect(302, '/');
};
