export const load = async ({ locals: { user, session } }) => {
	return {
		user,
		session
	};
};
