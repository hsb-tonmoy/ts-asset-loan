import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (id === 'add') {
		return {
			form: superValidate(formSchema),
			status: null
		};
	} else if (id === 'list') {
		const statuses = await prisma.requestStatus.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return {
			statuses
		};
	} else if (!isNaN(Number(id))) {
		const status = await prisma.requestStatus.findUnique({
			where: {
				id: Number(id)
			}
		});

		if (status) {
			return {
				form: superValidate(status, formSchema),
				status
			};
		} else {
			throw error(404, { message: 'Not found' });
		}
	} else {
		throw error(404, { message: 'Not found' });
	}
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
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error creating status'
			});
		}
		return {
			form
		};
	}
};
