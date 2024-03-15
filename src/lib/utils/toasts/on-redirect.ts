import { toastError, toastInfo } from '@/utils/toasts';

const redirectCause = {
	unauthenticated: 'You do not have permission to access the requested page. Please sign in!',
	verified: 'You already verified your email. You can continue using the app!'
} as const;

export const setRedirectUrl = (cause: RedirectCause) => `/?cause=${cause}`;

export const showRedirectToast = (cause: RedirectCause) => {
	switch (cause) {
		case 'unauthenticated':
			return toastError(redirectCause['unauthenticated']);
		case 'verified':
			return toastInfo(redirectCause['verified']);
	}
};

export type RedirectCause = keyof typeof redirectCause;
