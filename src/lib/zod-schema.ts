import { z } from 'zod';

export const signinFormSchema = z.object({
	email: z.string().email({ message: 'Email must be valid' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export type SigninForm = z.infer<typeof signinFormSchema>;

export const validationCodeSchema = z.object({
	code: z.string().min(6, { message: 'Enter valid code' })
});

export type ValidationCode = z.infer<typeof validationCodeSchema>;
