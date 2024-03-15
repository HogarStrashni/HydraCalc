import { RATE_LIMITER_SECRET } from '$env/static/private';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

export const createRateLimiter = (limitPerMinute = 3, cookieName: string) => {
	return new RateLimiter({
		// A rate is defined as [number, unit]
		IP: [20, 'h'], // IP address limiter
		IPUA: [10, 'm'], // IP + User Agent limiter
		cookie: {
			// Cookie limiter
			name: cookieName,
			secret: RATE_LIMITER_SECRET,
			rate: [limitPerMinute, 'm'],
			preflight: true // Require preflight call (see load function)
		}
	});
};
