import fs from 'fs/promises';
import path from 'path';
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
			asset: null
		};
	} else if (id === 'list') {
		const assets = await prisma.asset.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return {
			assets
		};
	} else if (!isNaN(Number(id))) {
		const asset = await prisma.asset.findUnique({
			where: {
				id: Number(id)
			}
		});

		if (asset) {
			return {
				categories,
				form: superValidate(asset, formSchema),
				asset
			};
		} else {
			throw error(404, { message: 'Not found' });
		}
	} else {
		throw error(404, { message: 'Not found' });
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const filePath = await saveFile(formData);

		try {
			await prisma.asset.create({
				data: {
					name: form.data.name,
					image: filePath,
					asset_tag: form.data.asset_tag,
					category: {
						connect: { id: Number(form.data.category) }
					},
					description: form.data.description
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error creating asset'
			});
		}
		return message(form, 'asset successfully created');
	},
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		try {
			const existingasset = await prisma.asset.findUnique({
				where: {
					id: Number(id)
				}
			});

			let filePath = existingasset?.image;

			const newImage = formData.get('image');
			if (newImage && newImage instanceof Blob && newImage.size > 0) {
				if (existingasset?.image) {
					await deleteFile(existingasset.image);
				}

				filePath = await saveFile(formData);
			}

			await prisma.asset.update({
				where: {
					id: Number(id)
				},
				data: {
					name: form.data.name,
					image: filePath,
					asset_tag: form.data.asset_tag,
					category: {
						connect: { id: Number(form.data.category) }
					},
					description: form.data.description
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error updating asset'
			});
		}
		return message(form, 'asset successfully updated');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const id = formData.get('id');

		try {
			const existingasset = await prisma.asset.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (existingasset?.image) {
				await deleteFile(existingasset.image);
			}
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting asset'
			});
		}

		try {
			await prisma.asset.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting asset'
			});
		}
		return message(form, 'asset successfully deleted');
	}
};

async function saveFile(formData: FormData) {
	const filePath = path.join(
		'static',
		'uploads',
		'assets',
		`${crypto.randomUUID()}.${(formData.get('image') as Blob).type.split('/')[1]}`
	);

	const dir = path.dirname(filePath);

	await fs.mkdir(dir, { recursive: true });

	try {
		await fs.writeFile(filePath, Buffer.from(await (formData.get('image') as Blob).arrayBuffer()));
		return filePath;
	} catch (err) {
		console.log(err);
		throw error(500, {
			message: 'Error uploading image'
		});
	}
}

async function deleteFile(filePath: string) {
	const basePath = path.join('static', 'uploads', 'assets');

	const relativeFilePath = path.relative(basePath, filePath);
	const resolvedPath = path.resolve(basePath, relativeFilePath);

	if (!resolvedPath.startsWith(path.resolve(basePath))) {
		throw new Error('Invalid file path');
	}

	try {
		await fs.access(resolvedPath);
		await fs.unlink(resolvedPath);
	} catch (err) {
		console.error(`Error deleting file at ${resolvedPath}:`, err);
		throw error(500, 'File deletion failed');
	}
}
