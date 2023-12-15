import type { LayoutServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: LayoutServerLoad = async () => {
	const siteSettings = await prisma.siteSettings.findMany();

	return {
		siteSettings: siteSettings[0]
	};
};
