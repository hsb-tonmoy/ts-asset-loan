import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';

	const categories = await prisma.equipmentCategory.findMany({
		orderBy: {
			id: 'asc'
		},
		where: {
			name: {
				contains: search
			}
		}
	});

	return json(categories);
};
