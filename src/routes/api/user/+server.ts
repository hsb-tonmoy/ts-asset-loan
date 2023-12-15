import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const offset = parseInt(url.searchParams.get('offset') || '0');

	const users = await prisma.user.findMany({
		take: limit,
		skip: offset,
		orderBy: {
			id: 'asc'
		},
		where: {
			OR: [
				{
					firstName: {
						contains: search
					}
				},
				{
					lastName: {
						contains: search
					}
				},
				{
					email: {
						contains: search
					}
				}
			]
		}
	});

	return json(users);
};
