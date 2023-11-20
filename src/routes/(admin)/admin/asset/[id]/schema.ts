import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
	asset_tag: z.string().min(2, { message: 'Asset tag must be at least 2 characters long' }),
	category: z.string().min(1, { message: 'You must choose a category' }),
	image: z.string().optional().nullable(),
	description: z.string().optional().nullable()
});

export type FormSchema = typeof formSchema;
