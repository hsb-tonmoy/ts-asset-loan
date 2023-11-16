import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
	statusColor: z.string().min(2, { message: 'Status Color must be at least 2 characters long' }),
	description: z
		.string()
		.min(2, { message: 'Description must be at least 2 characters long' })
		.optional()
});

export type FormSchema = typeof formSchema;
