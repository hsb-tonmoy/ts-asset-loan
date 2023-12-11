import fs from 'fs/promises';
import path from 'path';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ params, url }) => {
	const { id } = params;

	const search = url.searchParams.get('search') || '';

	if (id === 'add') {
		return {
			form: superValidate(formSchema),
			category: null
		};
	} else if (id === 'list') {
		const categories = await prisma.assetCategory.findMany({
			orderBy: {
				id: 'asc'
			},
			where: {
				name: {
					contains: search
				}
			}
		});

		return {
			categories
		};
	} else if (!isNaN(Number(id))) {
		const category = await prisma.assetCategory.findUnique({
			where: {
				id: Number(id)
			}
		});

		if (category) {
			return {
				form: superValidate(category, formSchema),
				category
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
			await prisma.assetCategory.create({
				data: {
					name: form.data.name,
					image: filePath,
					description: form.data.description
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error creating category'
			});
		}
		return message(form, 'category successfully created');
	},
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		try {
			const existingCategory = await prisma.assetCategory.findUnique({
				where: {
					id: Number(id)
				}
			});

			let filePath = existingCategory?.image;

			const newImage = formData.get('image');
			if (newImage instanceof Blob) {
				if (newImage.size > 0) {
					// A new image has been provided
					if (existingCategory?.image) {
						await deleteFile(existingCategory.image);
					}
					filePath = await saveFile(formData);
				} else {
					// The user wants to delete the image
					if (existingCategory?.image) {
						await deleteFile(existingCategory.image);
					}
					filePath = null;
				}
			}

			await prisma.assetCategory.update({
				where: {
					id: Number(id)
				},
				data: {
					name: form.data.name,
					image: filePath,
					description: form.data.description
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error updating category'
			});
		}
		return message(form, 'category successfully updated');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const id = formData.get('id');

		try {
			const existingCategory = await prisma.assetCategory.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (existingCategory?.image) {
				await deleteFile(existingCategory.image);
			}
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting category'
			});
		}

		try {
			await prisma.assetCategory.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error deleting category'
			});
		}
		return message(form, 'category successfully deleted');
	}
};

async function saveFile(formData: FormData) {
	const imageFile = formData.get('image') as File;
	if (!imageFile) return;

	const originalFileName = imageFile.name;
	const fileExtension = originalFileName.split('.').pop();

	if (!fileExtension) return;

	const filePath = path.join(
		'static',
		'uploads',
		'categories',
		`${crypto.randomUUID()}.${fileExtension}`
	);

	const dir = path.dirname(filePath);

	await fs.mkdir(dir, { recursive: true });

	try {
		await fs.writeFile(filePath, Buffer.from(await imageFile.arrayBuffer()));
		return filePath;
	} catch (err) {
		console.log(err);
		throw error(500, {
			message: 'Error uploading image'
		});
	}
}

async function deleteFile(filePath: string) {
	const basePath = path.join('static', 'uploads', 'categories');

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
		return;
	}
}
