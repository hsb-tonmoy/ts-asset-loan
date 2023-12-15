import { superValidate, message } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { fail, type Actions, error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const siteSettingsAll = await prisma.siteSettings.findMany();
	const siteSettings = siteSettingsAll[0];

	return {
		form: superValidate(siteSettings, formSchema),
		siteSettings
	};
};

export const actions: Actions = {
	update: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const { id } = form.data;

		console.log(form.data);

		try {
			await prisma.siteSettings.update({
				where: {
					id: Number(id)
				},
				data: form.data
			});
		} catch (err) {
			console.log(err);
			throw error(500, {
				message: 'Error updating settings'
			});
		}
		return message(form, 'Settings successfully updated');
	}
};
