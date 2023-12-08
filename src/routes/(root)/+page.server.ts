import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { formSchema } from '$lib/components/Home/RequestForm/schema';
import { error, fail } from '@sveltejs/kit';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	const categories = await prisma.assetCategory.findMany({
		include: {
			assets: true
		}
	});
	if (session) {
		return {
			categories,
			form: superValidate(formSchema),
			user: session.user
		};
	}
	return {
		categories,
		form: superValidate(formSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);

		if (!form.valid) return fail(400, { form });

		const status = await prisma.requestStatus.findFirst({
			where: {
				name: 'Pending'
			}
		});

		const session = await event.locals.auth.validate();

		try {
			await prisma.request.create({
				data: {
					...form.data,
					requestedCategories: form.data.requestedCategories,
					status: {
						connect: {
							id: status?.id
						}
					},
					...(session && {
						user: {
							connect: {
								id: session.user?.userId
							}
						}
					})
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
