import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
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
	// default: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	const form = await superValidate(formData, formSchema);

	// 	if (!form.valid) return fail(400, { form });

	// 	const id = formData.get('id') ? Number(formData.get('id')) : null;

	// 	console.log(id);

	// 	if (formData.has('delete') && id) {
	// 		try {
	// 			await prisma.requestStatus.delete({
	// 				where: {
	// 					id
	// 				}
	// 			});
	// 		} catch (err) {
	// 			console.log(err);
	// 			throw error(500, {
	// 				message: 'Error deleting status'
	// 			});
	// 		}
	// 		return message(form, 'Status successfully deleted');
	// 	}

	// 	if (id) {
	// 		try {
	// 			await prisma.requestStatus.update({
	// 				where: {
	// 					id: Number(formData.get('id'))
	// 				},
	// 				data: {
	// 					name: form.data.name,
	// 					description: form.data.description,
	// 					statusColor: form.data.statusColor
	// 				}
	// 			});
	// 		} catch (err) {
	// 			console.log(err);
	// 			throw error(500, {
	// 				message: 'Error updating status'
	// 			});
	// 		}
	// 		return message(form, 'Status successfully updated');
	// 	} else {
	// 		try {
	// 			await prisma.requestStatus.create({
	// 				data: {
	// 					name: form.data.name,
	// 					description: form.data.description,
	// 					statusColor: form.data.statusColor
	// 				}
	// 			});
	// 		} catch (err) {
	// 			console.log(err);
	// 			throw error(500, {
	// 				message: 'Error creating status'
	// 			});
	// 		}
	// 		return message(form, 'Status successfully created');
	// 	}
	// },
	create: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

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
		return message(form, 'Status successfully created');
	},
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		try {
			await prisma.requestStatus.update({
				where: {
					id: Number(id)
				},
				data: {
					name: form.data.name,
					description: form.data.description,
					statusColor: form.data.statusColor
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error updating status'
			});
		}
		return message(form, 'Status successfully updated');
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		try {
			await prisma.requestStatus.delete({
				where: {
					id: Number(formData.get('id'))
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting status'
			});
		}
		return message(form, 'Status successfully deleted');
	}
};
