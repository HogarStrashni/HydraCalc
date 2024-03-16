declare namespace NodeJS {
	interface ProcessEnv {
		TURSO_DATABASE_URL: string;
		TURSO_AUTH_TOKEN: string;
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		RESEND_API_KEY: string;
		RATE_LIMITER_SECRET: string;
		BASE_URL: string;
	}
}
