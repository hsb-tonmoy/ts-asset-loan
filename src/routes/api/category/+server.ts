import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const includeAssets = url.searchParams.get('includeAssets') === 'true';

	const statuses = await prisma.assetCategory.findMany({
		take: limit,
		skip: offset,
		orderBy: {
			id: 'asc'
		},
		include: includeAssets
			? {
					assets: {
						orderBy: {
							id: 'asc'
						}
					}
			  }
			: undefined,
		where: {
			name: {
				contains: search.toLowerCase()
			}
		}
	});

	return json(statuses);
};
