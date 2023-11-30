import { render } from 'svelte-email';
import RequestSubmitted from '$lib/components/Email/RequestSubmitted.svelte';
import sendgrid from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '$env/static/private';

sendgrid.setApiKey(SENDGRID_API_KEY);

const emailHtml = render({
	component: RequestSubmitted,
	props: {
		name: 'Svelte'
	}
});

const options = {
	from: 'you@example.com',
	to: 'user@gmail.com',
	subject: 'hello world',
	html: emailHtml
};

sendgrid.send(options);
