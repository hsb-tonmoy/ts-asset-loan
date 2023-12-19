import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().optional(),
	asset_tag: z.string().min(2, { message: 'You must choose an asset' }),
	user_id: z.string().min(1, { message: 'You must choose a User' }),
	checkout_date: z.string().min(1, { message: 'You must choose a date' }),
	checkin_date: z.string().optional(),
	approved_by_user_id: z.string(),
	notes: z.string().optional().nullable()
});

export type FormSchema = typeof formSchema;
