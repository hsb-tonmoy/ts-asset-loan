import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';

	const statuses = await prisma.assetStatus.findMany({
		orderBy: {
			id: 'asc'
		},
		where: {
			name: {
				contains: search.toLowerCase()
			}
		}
	});

	return json(statuses);
};
