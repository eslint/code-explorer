import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const capitalize = (substring: string): string =>
  substring.charAt(0).toUpperCase() + substring.slice(1);

export const
  encodeToBase64 = (text: string) => {
    return window.btoa(unescape(encodeURIComponent(text)));
  };

export const decodeFromBase64 = (base64: any) => {
  return decodeURIComponent(escape(window.atob(base64)));
}

export const storeState = () => {
  const serializedState = window.localStorage.getItem("eslint-explorer");
  const url = new URL(window.location.href);
  url.hash = encodeToBase64(serializedState || '');
  history.replaceState(null, '', url);
};