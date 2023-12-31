import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();

	const session = await locals.auth.validate();
	const { user } = session;

	// Loop through data and create a new asset checkout for each ID in assetIDs
	for (const assetID of data.assetIDs) {
		try {
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
							id: user.userId
						}
					}
				}
			});
		} catch (e) {
			console.log(e);
			return new Response('Error checking out asset', { status: 500 });
		}
		try {
			const assetStatus = await prisma.assetStatus.findUnique({
				where: {
					name: 'Checked Out'
				}
			});
			await prisma.asset.update({
				where: {
					id: assetID
				},
				data: {
					status: {
						connect: {
							id: assetStatus?.id
						}
					}
				}
			});
		} catch (e) {
			console.log(e);
			return new Response('Error updating asset', { status: 500 });
		}
	}

	try {
		const requestStatus = await prisma.requestStatus.findUnique({
			where: {
				name: 'Approved'
			}
		});
		await prisma.request.update({
			where: {
				id: data.request.id
			},
			data: {
				status: {
					connect: {
						id: requestStatus?.id
					}
				}
			}
		});
	} catch (e) {
		console.log(e);
		return new Response('Error updating request', { status: 500 });
	}

	return json({ data });
};

export const PATCH: RequestHandler = async ({ request }) => {
	const data = await request.json();

	try {
		await prisma.assetCheckout.update({
			where: {
				id: data.id
			},
			data: {
				checkin_date: data.checkin_date_time
			}
		});
	} catch (e) {
		console.log(e);
		return new Response('Error checking-in asset', { status: 500 });
	}

	const assetStatus = await prisma.assetStatus.findUnique({
		where: {
			name: 'Requestable'
		}
	});

	try {
		await prisma.asset.update({
			where: {
				asset_tag: data.asset_tag
			},
			data: {
				status: {
					connect: {
						id: assetStatus?.id
					}
				}
			}
		});
	} catch (e) {
		console.log(e);
		return new Response('Error updating asset', { status: 500 });
	}

	return new Response();
};
