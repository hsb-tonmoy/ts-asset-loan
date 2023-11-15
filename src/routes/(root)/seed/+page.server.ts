import { PrismaClient } from '@prisma/client';
import data from './data.json' assert { type: 'json' };
import type { PageServerLoad } from '../$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	try {
		console.log(`Start seeding ...`);
		for (const userData of data.User) {
			const user = await prisma.user.create({
				data: userData
			});
			console.log(`Created user with id: ${user.id}`);
		}

		// Seed Equipment Categories
		for (const equipmentCategoryData of data.EquipmentCategory) {
			const equipmentCategory = await prisma.equipmentCategory.create({
				data: equipmentCategoryData
			});
			console.log(`Created equipment category with id: ${equipmentCategory.id}`);
		}

		// Seed Request Statuses
		for (const requestStatusData of data.RequestStatus) {
			const requestStatus = await prisma.requestStatus.create({
				data: requestStatusData
			});
			console.log(`Created request status with id: ${requestStatus.id}`);
		}

		await prisma.$disconnect();

		return {
			message: 'Seed complete'
		};
	} catch (e) {
		console.error(e);
		await prisma.$disconnect();
	}
};
