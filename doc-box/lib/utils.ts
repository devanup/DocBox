import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const parseStringify = (data: any) => {
	return JSON.parse(JSON.stringify(data));
};
