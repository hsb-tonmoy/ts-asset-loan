import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
	asset_tag: z.string().min(2, { message: 'Asset tag must be at least 2 characters long' }),
	serial: z.string().optional().nullable(),
	model: z.string().optional().nullable(),
	location: z.string().optional().nullable(),
	purchase_cost: z.number().optional().nullable(),
	mac_address: z.string().optional().nullable(),
	imei: z.string().optional().nullable(),
	category: z.number().min(1, { message: 'You must choose a category' }),
	status: z.number().min(1, { message: 'You must choose a status' }),
	image: z.string().optional().nullable(),
	description: z.string().optional().nullable()
});

export type FormSchema = typeof formSchema;
