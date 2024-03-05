import { z } from 'zod';

export const signinFormSchema = z.object({
	email: z.string().email({ message: 'Email must be valid' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});
export type SigninForm = z.infer<typeof signinFormSchema>;

export const validationCodeFormSchema = z.object({
	code: z.string().min(6, { message: 'Enter valid code' })
});
export type ValidationCode = z.infer<typeof validationCodeFormSchema>;

export const resetPasswordFormSchema = z.object({
	email: z.string().email({ message: 'Email must be valid' })
});
export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;

export const newPasswordFormSchema = z.object({
	password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});
export type NewPasswordForm = z.infer<typeof newPasswordFormSchema>;
