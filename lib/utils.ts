import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const parseStringify = <T>(data: T): T => {
	return JSON.parse(JSON.stringify(data));
};
