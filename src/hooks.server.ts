import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authN: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};

const authZ: Handle = async ({ event, resolve }) => {
	const protectedPaths = ['/admin'];
	const { pathname } = event.url;

	if (protectedPaths.includes(pathname)) {
		const session = await event.locals.auth.validate();
		if (!session) {
			throw redirect(302, '/?login=true');
		}
	}

	return await resolve(event);
};

export const handle = sequence(authN, authZ);
