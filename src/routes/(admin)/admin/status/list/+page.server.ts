import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	const statuses = await prisma.requestStatus.findMany({
		orderBy: {
			id: 'asc'
		}
	});

	return {
		statuses
	};
};
