import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { auth } from '$lib/server/lucia';

import { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } from '$env/static/private';

export const GET: RequestHandler = async () => {
	const settings = await prisma.siteSettings.findFirst();

	if (settings) {
		return new Response('Already setup', {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} else {
		await prisma.siteSettings.create({
			data: {
				setup: true,
				admin_email: 'billF@kpl.gov',
				default_assignto_user_email: 'billF@kpl.gov'
			}
		});
	}

	try {
		await auth.createUser({
			key: {
				providerId: 'email',
				providerUserId: SUPERADMIN_EMAIL.toLowerCase(),
				password: SUPERADMIN_PASSWORD
			},
			attributes: {
				email: SUPERADMIN_EMAIL.toLowerCase(),
				firstName: 'Super',
				lastName: 'Admin',
				role: 'admin'
			}
		});
		await prisma.assetStatus.upsert({
			create: {
				name: 'Requestable',
				statusColor: '#c2581b'
			},
			update: {},
			where: { name: 'Requestable' }
		});

		await prisma.assetStatus.upsert({
			create: {
				name: 'Checked Out',
				statusColor: '#128c0b'
			},
			update: {},
			where: { name: 'Checked Out' }
		});

		await prisma.requestStatus.upsert({
			create: {
				name: 'Pending',
				statusColor: '#c2581b'
			},
			update: {},
			where: { name: 'Pending' }
		});

		await prisma.requestStatus.upsert({
			create: {
				name: 'Approved',
				statusColor: '#128c0b'
			},
			update: {},
			where: { name: 'Approved' }
		});

		await prisma.requestStatus.upsert({
			create: {
				name: 'Denied',
				statusColor: '#c2581b'
			},
			update: {},
			where: { name: 'Denied' }
		});

		await prisma.requestStatus.upsert({
			create: {
				name: 'Returned',
				statusColor: '#128c0b'
			},
			update: {},
			where: { name: 'Returned' }
		});
	} catch (e) {
		console.log(e);
		return new Response('Error', {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	return new Response();
};
