import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().optional(),
	site_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
	site_description: z.string().optional().nullable(),
	maintenance_mode: z.boolean().optional(),
	maintenance_mode_message: z.string().optional(),
	admin_email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
	default_assignto_user_email: z
		.string()
		.email({ message: 'Please enter a valid email address' })
		.optional()
});

export type FormSchema = typeof formSchema;
