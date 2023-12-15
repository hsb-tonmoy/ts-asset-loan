import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (id === 'add') {
		return {
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
		const checkouts = await prisma.assetCheckout.findUnique({
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

		if (checkouts) {
			return {
				checkouts
			};
		} else {
			throw error(404, { message: 'Not found' });
		}
	} else {
		throw error(404, { message: 'Not found' });
	}
};

export const actions: Actions = {
	// 	create: async ({ request }) => {
	// 		const formData = await request.formData();
	// 		const form = await superValidate(formData, formSchema);

	// 		if (!form.valid) return fail(400, { form });

	// 		const filePath = await saveFile(formData);
	// 		try {
	// 			await prisma.assetCheckout.create({
	// 				data: {
	// 					name: form.data.name,
	// 					image: filePath,
	// 					asset_tag: form.data.asset_tag,
	// 					serial: form.data.serial,
	// 					model: form.data.model,
	// 					location: form.data.location,
	// 					purchase_cost: Number(form.data.purchase_cost),
	// 					mac_address: form.data.mac_address,
	// 					imei: form.data.imei,
	// 					category: {
	// 						connect: { id: Number(form.data.category) }
	// 					},
	// 					status: {
	// 						connect: { id: form.data.status }
	// 					},
	// 					description: form.data.description
	// 				}
	// 			});
	// 		} catch (err) {
	// 			console.log(err);
	// 			throw error(500, {
	// 				message: 'Error creating assetCheckout'
	// 			});
	// 		}
	// 		return message(form, 'assetCheckout successfully created');
	// 	},
	// 	update: async ({ request, params }) => {
	// 		const { id } = params;
	// 		const formData = await request.formData();
	// 		const form = await superValidate(formData, formSchema);

	// 		console.log(form.data);

	// 		if (!form.valid) return fail(400, { form });

	// 		try {
	// 			const existingAsset = await prisma.assetCheckout.findUnique({
	// 				where: {
	// 					id: Number(id)
	// 				}
	// 			});

	// 			let filePath = existingAsset?.image;

	// 			const newImage = formData.get('image');
	// 			if (newImage instanceof Blob) {
	// 				if (newImage.size > 0) {
	// 					// A new image has been provided
	// 					if (existingAsset?.image) {
	// 						await deleteFile(existingAsset.image);
	// 					}
	// 					filePath = await saveFile(formData);
	// 				} else {
	// 					// The user wants to delete the image
	// 					if (existingAsset?.image) {
	// 						await deleteFile(existingAsset.image);
	// 					}
	// 					filePath = null;
	// 				}
	// 			}

	// 			await prisma.assetCheckout.update({
	// 				where: {
	// 					id: Number(id)
	// 				},
	// 				data: {
	// 					name: form.data.name,
	// 					image: filePath,
	// 					asset_tag: form.data.asset_tag,
	// 					serial: form.data.serial,
	// 					model: form.data.model,
	// 					location: form.data.location,
	// 					purchase_cost: Number(form.data.purchase_cost),
	// 					mac_address: form.data.mac_address,
	// 					imei: form.data.imei,
	// 					category: {
	// 						connect: { id: Number(form.data.category) }
	// 					},
	// 					status: {
	// 						connect: { id: Number(form.data.status) }
	// 					},
	// 					description: form.data.description
	// 				}
	// 			});
	// 		} catch (err) {
	// 			console.log(err);
	// 			throw error(500, {
	// 				message: 'Error updating assetCheckout'
	// 			});
	// 		}
	// 		return message(form, 'assetCheckout successfully updated');
	// 	},

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
