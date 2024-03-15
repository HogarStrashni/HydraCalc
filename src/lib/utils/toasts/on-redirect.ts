import { toastError, toastInfo } from '@/utils/toasts';

const redirectCause = {
	unauthenticated: 'You do not have permission to access the requested page. Please sign in!',
	verified: 'You already verified your email. Continue using the app!',
	unverified: 'You already signed in. Please verify your email!'
} as const;

export const setRedirectUrl = (cause: RedirectCause, pathname = '/') =>
	`${pathname}?cause=${cause}`;

export const showRedirectToast = (cause: RedirectCause) => {
	switch (cause) {
		case 'unauthenticated':
			return toastError(redirectCause['unauthenticated']);
		case 'verified':
			return toastInfo(redirectCause['verified']);
		case 'unverified':
			return toastInfo(redirectCause['unverified']);
	}
};

export type RedirectCause = keyof typeof redirectCause;
