import type { Config } from 'drizzle-kit';

const { TURSO_DATABASE_URL } = process.env;

if (!TURSO_DATABASE_URL) {
	throw new Error(
		'No database URL defined in the environment variables. Please ensure it is set in the .env file.'
	);
}

export default {
	schema: './src/lib/database/schema',
	out: './migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN
	}
} satisfies Config;
