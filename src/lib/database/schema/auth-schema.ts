import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	id: text('id').primaryKey().notNull(),
	email: text('email').notNull().unique(),
	password: text('password'),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const sessionsTable = sqliteTable('sessions', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: integer('expires_at').notNull()
});
