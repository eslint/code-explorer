import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number,
) {
	let timeoutId: ReturnType<typeof setTimeout>;

	const debounced = (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};

	debounced.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	};

	return debounced as ((...args: Parameters<T>) => void) & {
		cancel: () => void;
	};
}

export const getPreferredColorScheme = () => {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

export function assert(value: unknown): asserts value {
	if (!value) {
		throw new Error("Assertion failed");
	}
}

export function assertIsUnreachable(value: never): never {
	throw new Error(`Unexpected value: ${value}`);
}
