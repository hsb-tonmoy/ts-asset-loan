import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const offset = parseInt(url.searchParams.get('offset') || '0');

	const statuses = await prisma.asset.findMany({
		take: limit,
		skip: offset,
		orderBy: {
			id: 'asc'
		},
		where: {
			status: {
				name: 'Requestable'
			},
			OR: [
				{
					asset_tag: {
						equals: search.toLowerCase()
					}
				},
				{
					serial: {
						equals: search.toLowerCase()
					}
				},
				{
					name: {
						contains: search.toLowerCase()
					}
				},
				{
					imei: {
						equals: search.toLowerCase()
					}
				},
				{
					model: {
						contains: search.toLowerCase()
					}
				}
			]
		}
	});

	return json(statuses);
};
