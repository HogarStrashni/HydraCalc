import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, locals: { session } }) => {
	if (!session) {
		return new Response(null, {
			status: 400
		});
	}

	await lucia.invalidateSession(session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	redirect(302, '/');
};
