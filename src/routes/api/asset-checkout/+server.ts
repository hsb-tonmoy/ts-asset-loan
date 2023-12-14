import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	// Loop through data and create a new asset checkout for each ID in assetIDs
	for (const assetID of data.assetIDs) {
		await prisma.assetCheckout.create({
			data: {
				request: {
					connect: {
						id: data.request.id
					}
				},
				asset: {
					connect: {
						id: assetID
					}
				},
				user: {
					connect: {
						id: data.request.user_id
					}
				},
				approved_by_user: {
					connect: {
						id: data.approved_by_user
					}
				}
			}
		});
	}

	return json({ data });
};
