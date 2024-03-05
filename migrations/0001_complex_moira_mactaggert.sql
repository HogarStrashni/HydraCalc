CREATE TABLE `password_reset_code` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_code_user_id_unique` ON `password_reset_code` (`user_id`);