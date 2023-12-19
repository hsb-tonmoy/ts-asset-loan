import { error, type Actions, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { formSchema } from './schema';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (id === 'add') {
		return {
			form: superValidate(formSchema),
			assetCheckout: null
		};
	} else if (id === 'list') {
		const checkouts = await prisma.assetCheckout.findMany({
			include: {
				asset: {
					include: {
						category: true
					}
				},
				user: true,
				approved_by_user: true
			},

			orderBy: {
				id: 'asc'
			}
		});

		return {
			checkouts
		};
	} else if (!isNaN(Number(id))) {
		const checkout = await prisma.assetCheckout.findUnique({
			where: {
				id: Number(id)
			},
			include: {
				asset: {
					include: {
						category: true
					}
				},
				user: true,
				approved_by_user: true
			}
		});

		if (checkout) {
			return {
				form: superValidate(checkout, formSchema),
				checkout
			};
		} else {
			throw error(404, { message: 'Not found' });
		}
	} else {
		throw error(404, { message: 'Not found' });
	}
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const session = await locals.auth.validate();

		delete formData.asset_tag;

		try {
			await prisma.assetCheckout.create({
				data: {
					...formData,
					approved_by_user: {
						connect: {
							id: session?.user.userId
						}
					},
					user: {
						connect: {
							email: form.data.user_id
						}
					},
					asset: {
						connect: {
							asset_tag: form.data.asset_tag
						}
					}
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error creating assetCheckout'
			});
		}
		return message(form, 'assetCheckout successfully created');
	},
	update: async ({ request, params, locals }) => {
		const { id } = params;
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const session = await locals.auth.validate();

		delete formData.asset_tag;
		delete formData.id;

		try {
			await prisma.assetCheckout.update({
				where: {
					id: Number(id)
				},
				data: {
					...formData,
					approved_by_user: {
						connect: {
							id: session?.user.userId
						}
					},
					user: {
						connect: {
							email: form.data.user_id
						}
					},
					asset: {
						connect: {
							asset_tag: form.data.asset_tag
						}
					}
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error updating checkout'
			});
		}
		return message(form, 'Checkout successfully updated');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id');

		try {
			await prisma.assetCheckout.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting checkout'
			});
		}
		return;
	}
};
