import type { RequestHandler } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { auth } from '$lib/server/lucia';

export const POST: RequestHandler = async ({ request, locals }) => {
	const formData = await request.json();

	const { email, password } = formData;

	if (typeof email !== 'string' || email.length < 1 || email.length > 31) {
		return new Response('Invalid email', {
			status: 400
		});
	}
	if (typeof password !== 'string' || password.length < 1 || password.length > 255) {
		return new Response('Invalid password', {
			status: 400
		});
	}
	try {
		const key = await auth.useKey('email', email.toLowerCase(), password);
		const session = await auth.createSession({
			userId: key.userId,
			attributes: {}
		});
		locals.auth.setSession(session); // set session cookie
	} catch (e) {
		if (
			e instanceof LuciaError &&
			(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
		) {
			// user does not exist
			// or invalid password
			return new Response('Invalid email or password', {
				status: 400
			});
		}
		return new Response('Something went wrong', {
			status: 500
		});
	}

	return new Response('Success', {
		status: 200
	});
};
