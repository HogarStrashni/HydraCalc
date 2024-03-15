import type { ActionResult } from '@sveltejs/kit';
import { toastError, toastInfo, toastSuccess } from '.';

const formActionMessages = {
	'reset-password':
		'Reset password link has been sent... Check your email and signin with new password!',
	'validation-code': 'Your new validation code has been sent... Check your email!',
	'verify-email': 'You succesfully signed in... Please verify your email!',
	'too-many-requests':
		'You have sent too many requests in a short period of time and exceeded the rate limit'
};

export const showFormActionToast = (
	formActionMessage: FormActionMessages,
	result: ActionResult
) => {
	switch (formActionMessage) {
		case 'reset-password':
			if (result.type === 'redirect' && result.location === '/') {
				return toastSuccess(formActionMessages['reset-password']);
			}
		case 'validation-code':
			if (result.type === 'redirect' && result.location === '/email-verification') {
				return toastSuccess(formActionMessages['validation-code']);
			}
		case 'verify-email':
			if (result.type === 'redirect' && result.location === '/email-verification') {
				return toastInfo(formActionMessages['verify-email']);
			}
		case 'too-many-requests':
			if (result.status === 429) {
				toastError(formActionMessages['too-many-requests']);
			}
	}
};

type FormActionMessages = keyof typeof formActionMessages;
