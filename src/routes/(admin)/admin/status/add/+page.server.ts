import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { fail } from '@sveltejs/kit';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	return {
		form: superValidate(formSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await prisma.requestStatus.create({
				data: {
					name: form.data.name,
					description: form.data.description,
					statusColor: form.data.statusColor
				}
			});
		} catch (error) {
			console.log(error);
			return fail(500);
		}
		return {
			form
		};
	}
};
