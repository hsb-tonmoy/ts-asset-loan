import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().optional(),
	user_id: z.number(),
	status_id: z.number(),
	requestedCategories: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phone: z.string().optional().nullable(),
	requestDateTime: z.date(),
	returnDateTime: z.date(),
	notes: z.string().optional().nullable(),
	assigned_to_user_id: z.number().optional().nullable(),
	approved_by_user_id: z.number().optional().nullable()
});

export type FormSchema = typeof formSchema;
