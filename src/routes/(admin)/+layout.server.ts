import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/?login=true');
	} else if (session && session.user.role !== 'admin') {
		throw redirect(302, '/');
	} else {
		return {
			user: session.user
		};
	}
};
