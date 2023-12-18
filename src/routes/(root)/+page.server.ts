import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { formSchema } from '$lib/components/Home/RequestForm/schema';
import { error, fail } from '@sveltejs/kit';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const session = await locals.auth.validate();

	const { siteSettings } = await parent();

	const categories = await prisma.assetCategory.findMany({
		include: {
			assets: true
		}
	});
	if (session) {
		return {
			siteSettings,
			categories,
			form: superValidate(formSchema),
			user: session.user
		};
	}
	return {
		siteSettings,
		categories,
		form: superValidate(formSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);

		if (!form.valid) return fail(400, { form });

		const formData = form.data;

		const status = await prisma.requestStatus.findFirst({
			where: {
				name: 'Pending'
			}
		});

		const session = await event.locals.auth.validate();

		if (form.data.updatePhone) {
			try {
				await prisma.user.update({
					where: {
						id: session.user?.userId
					},
					data: {
						phone: form.data.phone
					}
				});
			} catch (err) {
				console.log(err);
			}
		}

		delete formData.updatePhone;

		try {
			await prisma.request.create({
				data: {
					...formData,
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
