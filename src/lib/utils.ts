import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const convertToImageURL = (file: string) => {
	if (file) {
		const imagePath = file.replace(/\\/g, '/').replace(/^static\//, '');
		const image = '/' + imagePath;

		return image;
	}

	return '';
};

export const formatDateTime = (dateTimeString: string) => {
	if (dateTimeString === null) return '';
	const date = new Date(dateTimeString);
	const currentYear = new Date().getFullYear();

	const dateOptions = {
		year: currentYear === date.getFullYear() ? undefined : 'numeric',
		month: 'short',
		day: 'numeric'
	};

	const formattedDate = date.toLocaleDateString('en-US', dateOptions);

	const formattedTime = date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		hour12: true
	});

	return `${formattedDate} at ${formattedTime}`;
};

export const convertDateTime = (dateString: string, timeString: string) => {
	const date = new Date(dateString + 'T00:00:00');

	const [hours, minutes] = timeString.split(':').map(Number);

	date.setHours(hours, minutes, 0, 0);

	return date;
};

export const extractDate = (dateObj) => {
	return dateObj.toISOString().split('T')[0];
};

export const extractTime = (dateObj) => {
	return dateObj.toISOString().split('T')[1].slice(0, 5);
};
