import fs from 'fs/promises';
import path from 'path';
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
			category: null
		};
	} else if (id === 'list') {
		const categories = await prisma.equipmentCategory.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return {
			categories
		};
	} else if (!isNaN(Number(id))) {
		const category = await prisma.equipmentCategory.findUnique({
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

		const filePath = path.join(
			'static',
			'uploads',
			'categories',
			`${crypto.randomUUID()}.${(formData.get('image') as Blob).type.split('/')[1]}`
		);

		const dir = path.dirname(filePath);

		await fs.mkdir(dir, { recursive: true });

		try {
			await fs.writeFile(
				filePath,
				Buffer.from(await (formData.get('image') as Blob).arrayBuffer())
			);
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error uploading image'
			});
		}

		try {
			await prisma.equipmentCategory.create({
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
			await prisma.equipmentCategory.update({
				where: {
					id: Number(id)
				},
				data: {
					name: form.data.name,
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

		try {
			await prisma.equipmentCategory.delete({
				where: {
					id: Number(formData.get('id'))
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
