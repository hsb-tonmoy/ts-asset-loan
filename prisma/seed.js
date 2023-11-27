import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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
