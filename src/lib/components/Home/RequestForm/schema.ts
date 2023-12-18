import { z } from 'zod';

export const formSchema = z.object({
	requestedCategories: z.string().optional(),
	firstName: z.string().min(2, { message: 'First name must be at least 2 characters long' }),
	lastName: z.string().min(2, { message: 'Last name must be at least 2 characters long' }),
	email: z.string().email({ message: 'Please enter a valid email address' }),
	phone: z.string().min(10, { message: 'Phone number must be at least 10 characters long' }),
	requestDateTime: z.string().min(10, { message: 'Please enter a valid date' }),
	returnDateTime: z.string().min(10, { message: 'Please enter a valid date' }),
	notes: z.string().optional(),
	updatePhone: z.boolean().optional()
});

export type FormSchema = typeof formSchema;
