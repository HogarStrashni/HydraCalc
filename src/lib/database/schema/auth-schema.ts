import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	id: text('id').primaryKey().notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
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

export const emailVerificationCodeTable = sqliteTable('email_verification_code', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	code: text('code').notNull(),
	userId: text('user_id').unique(),
	email: text('email').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const passwordResetTokenTable = sqliteTable('password_reset_code', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id').unique().notNull(),
	email: text('email').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});
