import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const capitalize = (substring: string): string =>
	substring.charAt(0).toUpperCase() + substring.slice(1);

export function debounce<T extends (...args: unknown[]) => void>(
	func: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
