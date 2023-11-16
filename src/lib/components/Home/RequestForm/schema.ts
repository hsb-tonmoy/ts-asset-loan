import { z } from 'zod';

export const formSchema = z.object({
	category: z.array(z.string()),
	firstName: z.string().min(2, { message: 'First name must be at least 2 characters long' }),
	lastName: z.string().min(2, { message: 'Last name must be at least 2 characters long' }),
	email: z.string().email({ message: 'Please enter a valid email address' }),
	phone: z.string().min(10, { message: 'Phone number must be at least 10 characters long' }),
	requestDate: z.string().min(10, { message: 'Please enter a valid date' }),
	requestTime: z.string().min(5, { message: 'Please enter a valid time' }),
	returnDate: z.string().min(10, { message: 'Please enter a valid date' }),
	returnTime: z.string().min(5, { message: 'Please enter a valid time' }),
	notes: z.string().optional()
});

export type FormSchema = typeof formSchema;
