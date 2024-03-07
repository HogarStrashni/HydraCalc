export const errorList = {
	400: {
		fallbackMessage: 'Bad Request',
		description: 'Your request is issued or malformed and resulted in an error'
	},
	401: {
		fallbackMessage: 'Unauthorized',
		description: 'You are not authorized to access this resource'
	},
	403: {
		fallbackMessage: 'Forbidden',
		description: 'You have no permission to access this page'
	},
	404: {
		fallbackMessage: 'Not Found',
		description: 'The page you are looking for does not exist or is temporarily unavailable'
	},
	429: {
		fallbackMessage: 'Too Many Requests',
		description:
			'You have sent too many requests in a short period of time and exceeded the rate limit'
	},
	500: {
		fallbackMessage: 'Internal Server Error',
		description: 'Looks like server failed to load your request'
	},
	503: {
		fallbackMessage: 'Service Unavailable',
		description: 'Looks like server is temporarily unavailable'
	}
};
