import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { formSchema } from '$lib/components/Home/RequestForm/schema';
import { error, fail } from '@sveltejs/kit';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	return {
		form: superValidate(formSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const status = await prisma.requestStatus.findFirst({
			where: {
				name: 'Pending'
			}
		});
		const form = await superValidate(event, formSchema);

		if (!form.valid) return fail(400, { form });

		try {
			await prisma.request.create({
				data: {
					...form.data,
					requestedCategories: JSON.stringify(form.data.requestedCategories),
					status: {
						connect: {
							id: status?.id
						}
					}
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error creating asset'
			});
		}

		return message(form, 'asset successfully created');
	}
};
