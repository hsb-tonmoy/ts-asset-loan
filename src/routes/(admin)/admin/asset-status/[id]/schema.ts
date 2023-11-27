import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
	statusColor: z.string().min(2, { message: 'You must choose a color' }),
	description: z.string().optional().nullable()
});

export type FormSchema = typeof formSchema;
