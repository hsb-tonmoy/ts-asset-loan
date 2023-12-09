import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (id === 'list') {
		const users = await prisma.user.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return {
			users
		};
	} else {
		const user = await prisma.user.findUnique({
			where: {
				id: id
			}
		});

		if (user) {
			return {
				form: superValidate(user, formSchema),
				user
			};
		} else {
			throw error(404, { message: 'Not found' });
		}
	}
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		try {
			await prisma.user.update({
				where: {
					id: id
				},
				data: {
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					role: form.data.role
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error updating user'
			});
		}
		return message(form, 'user successfully updated');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const id = formData.get('id') as string;

		try {
			await prisma.user.delete({
				where: {
					id: id
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting user'
			});
		}
		return message(form, 'user successfully deleted');
	}
};
