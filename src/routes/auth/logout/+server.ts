import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session)
		return new Response(null, {
			status: 401
		});
	await auth.invalidateSession(session.sessionId);
	const sessionCookie = auth.createSessionCookie(null);
	locals.auth.setSession(null);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
			'Set-Cookie': sessionCookie.serialize()
		}
	});
};
