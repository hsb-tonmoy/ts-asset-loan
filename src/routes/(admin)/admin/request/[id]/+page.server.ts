import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const categories = await prisma.equipmentCategory.findMany({
		orderBy: {
			name: 'asc'
		}
	});

	if (id === 'add') {
		return {
			categories,
			form: superValidate(formSchema),
			request: null
		};
	} else if (id === 'list') {
		const requests = await prisma.request.findMany({
			include: {
				status: true,
				approved_by_user: true,
				assets: true
			},
			orderBy: {
				id: 'asc'
			}
		});

		return {
			categories,
			requests
		};
	} else if (!isNaN(Number(id))) {
		const request = await prisma.request.findUnique({
			where: {
				id: Number(id)
			},
			include: {
				status: true,
				approved_by_user: true,
				assets: true
			}
		});

		if (request) {
			return {
				categories,
				form: superValidate(request, formSchema),
				request
			};
		} else {
			throw error(404, { message: 'Not found' });
		}
	} else {
		throw error(404, { message: 'Not found' });
	}
};

export const actions: Actions = {
	// create: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	const form = await superValidate(formData, formSchema);

	// 	if (!form.valid) return fail(400, { form });

	// 	console.log(form.data);

	// 	const filePath = await saveFile(formData);
	// 	try {
	// 		await prisma.request.create({
	// 			data: {
	// 				name: form.data.name,
	// 				image: filePath,
	// 				request_tag: form.data.request_tag,
	// 				serial: form.data.serial,
	// 				model: form.data.model,
	// 				location: form.data.location,
	// 				purchase_cost: Number(form.data.purchase_cost),
	// 				mac_address: form.data.mac_address,
	// 				imei: form.data.imei,
	// 				category: {
	// 					connect: { id: Number(form.data.category) }
	// 				},
	// 				description: form.data.description
	// 			}
	// 		});
	// 	} catch (err) {
	// 		console.log(err);
	// 		throw error(500, {
	// 			message: 'Error creating request'
	// 		});
	// 	}
	// 	return message(form, 'request successfully created');
	// },
	// update: async ({ request, params }) => {
	// 	const { id } = params;
	// 	const formData = await request.formData();
	// 	const form = await superValidate(formData, formSchema);

	// 	console.log(form.data);

	// 	if (!form.valid) return fail(400, { form });

	// 	try {
	// 		const existingrequest = await prisma.request.findUnique({
	// 			where: {
	// 				id: Number(id)
	// 			}
	// 		});

	// 		let filePath = existingrequest?.image;

	// 		const newImage = formData.get('image');
	// 		if (newImage instanceof Blob && newImage.size > 0) {
	// 			if (existingrequest?.image) {
	// 				await deleteFile(existingrequest.image);
	// 			}
	// 			filePath = await saveFile(formData);
	// 		} else if (!newImage || newImage === '') {
	// 			// Check if newImage is empty and delete the existing file
	// 			if (existingrequest?.image) {
	// 				await deleteFile(existingrequest.image);
	// 				filePath = null; // Set filePath to null or empty string
	// 			}
	// 		}

	// 		await prisma.request.update({
	// 			where: {
	// 				id: Number(id)
	// 			},
	// 			data: {
	// 				name: form.data.name,
	// 				image: filePath,
	// 				request_tag: form.data.request_tag,
	// 				serial: form.data.serial,
	// 				model: form.data.model,
	// 				location: form.data.location,
	// 				purchase_cost: Number(form.data.purchase_cost),
	// 				mac_address: form.data.mac_address,
	// 				imei: form.data.imei,
	// 				category: {
	// 					connect: { id: Number(form.data.category) }
	// 				},
	// 				description: form.data.description
	// 			}
	// 		});
	// 	} catch (err) {
	// 		console.log(err);
	// 		throw error(500, {
	// 			message: 'Error updating request'
	// 		});
	// 	}
	// 	return message(form, 'request successfully updated');
	// },

	delete: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		const id = formData.get('id');

		try {
			await prisma.request.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting request'
			});
		}
		return message(form, 'request successfully deleted');
	}
};
