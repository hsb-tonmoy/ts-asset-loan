import prisma from '$lib/prisma';

import type { PageServerLoad } from './$types';

export const load = (async () => {
	const response = await prisma.request.findMany({
		include: { assigned_to_user: true, equipmentCategory: true, status: true, user: true }
	});

	return { requests: response };
}) satisfies PageServerLoad;
