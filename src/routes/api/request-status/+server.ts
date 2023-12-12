import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const offset = parseInt(url.searchParams.get('offset') || '0');

	const statuses = await prisma.requestStatus.findMany({
		take: limit,
		skip: offset,
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
