import { z } from 'zod';

export const formSchema = z.object({
	id: z.string().optional(),
	firstName: z.string().min(2, { message: 'First name must be at least 2 characters long' }),
	lastName: z.string().min(2, { message: 'Last name must be at least 2 characters long' }),
	email: z.string().email({ message: 'Please enter a valid email address' }),
	phone: z.string().optional(),
	role: z.string().optional()
});

export type FormSchema = typeof formSchema;
