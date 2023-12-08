import { lucia } from 'lucia';
import { azureAD } from '@lucia-auth/oauth/providers';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';

import { AD_CLIENT_ID, AD_SECRET, AD_TENANT, AD_REDIRECT_URI } from '$env/static/private';

const client = new PrismaClient();

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(client),
	getUserAttributes: (data) => {
		return {
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			role: data.role
		};
	}
});

export const azureADAuth = azureAD(auth, {
	clientId: AD_CLIENT_ID,
	clientSecret: AD_SECRET,
	tenant: AD_TENANT,
	redirectUri: AD_REDIRECT_URI
	// scope: ['openid profile email']
});
