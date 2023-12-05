import { PrismaClient } from '@prisma/client';
import { auth } from '../src/lib/server/lucia';
// import { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } from '$env/static/private';

const { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;

const prisma = new PrismaClient();

async function main() {
	await auth.createUser({
		key: {
			providerId: 'email',
			providerUserId: SUPERADMIN_EMAIL.toLowerCase(),
			password: SUPERADMIN_PASSWORD
		},
		attributes: {
			email: SUPERADMIN_PASSWORD.toLowerCase(),
			role: 'Admin'
		}
	});
	await prisma.assetStatus.create({
		data: {
			name: 'Requestable',
			statusColor: '#c2581b'
		}
	});

	await prisma.assetStatus.create({
		data: {
			name: 'Checked Out',
			statusColor: '#128c0b'
		}
	});

	await prisma.requestStatus.create({
		data: {
			name: 'Pending',
			statusColor: '#c2581b'
		}
	});

	await prisma.requestStatus.create({
		data: {
			name: 'Approved',
			statusColor: '#128c0b'
		}
	});

	await prisma.requestStatus.create({
		data: {
			name: 'Denied',
			statusColor: '#c2581b'
		}
	});

	await prisma.requestStatus.create({
		data: {
			name: 'Returned',
			statusColor: '#128c0b'
		}
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})

	.catch(async (e) => {
		console.error(e);

		await prisma.$disconnect();

		process.exit(1);
	});
