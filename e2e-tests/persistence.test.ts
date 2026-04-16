/**
 * @fileoverview Tests for state persistence functionality.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { expect, test, type Page } from "@playwright/test";
import { getCodeEditor, replaceCodeEditorValue } from "./helpers/code-editor";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const storageKey = "eslint-explorer";

async function getPersistedJavaScriptCode(page: Page): Promise<string> {
	return page.evaluate(key => {
		const storedValue = window.localStorage.getItem(key);

		if (!storedValue) {
			return "";
		}

		return JSON.parse(storedValue).state.code.javascript;
	}, storageKey);
}

async function getPersistedExplorerState(page: Page): Promise<string> {
	const persistedValue = await page.evaluate(
		key => window.localStorage.getItem(key),
		storageKey,
	);

	if (!persistedValue) {
		throw new Error("Expected explorer state to be persisted");
	}

	return persistedValue;
}

async function getStoredHashValue(page: Page): Promise<string> {
	return page.evaluate(key => {
		return (
			new URLSearchParams(window.location.hash.slice(1)).get(key) ?? ""
		);
	}, storageKey);
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

test("should persist unicode code safely in the URL hash", async ({ page }) => {
	await page.addInitScript(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto("/");

	const unicodeCode = 'const \u03C0 = "\u{1F600}";';

	await replaceCodeEditorValue(page, unicodeCode);

	await expect.poll(() => getPersistedJavaScriptCode(page)).toBe(unicodeCode);
	await expect.poll(() => getStoredHashValue(page)).toContain("v2.");

	const persistedHash = await page.evaluate(() => window.location.hash);

	await page.evaluate(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto(`/${persistedHash}`);

	await expect(getCodeEditor(page)).toContainText(unicodeCode);
});

test("should still load state from legacy hash links", async ({ page }) => {
	await page.addInitScript(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto("/");

	const legacyCode = "console.log('legacy hash');";

	await replaceCodeEditorValue(page, legacyCode);

	await expect.poll(() => getPersistedJavaScriptCode(page)).toBe(legacyCode);

	const persistedValue = await getPersistedExplorerState(page);

	const legacyHash = await page.evaluate(
		([key, value]) => {
			const searchParams = new URLSearchParams();
			searchParams.set(key, btoa(JSON.stringify(value)));
			return searchParams.toString();
		},
		[storageKey, persistedValue],
	);

	await page.evaluate(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto(`/#${legacyHash}`);

	await expect(getCodeEditor(page)).toContainText(legacyCode);
});

test("should fall back to localStorage when a v2 hash is malformed", async ({
	page,
}) => {
	await page.addInitScript(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto("/");

	const fallbackCode = "console.log('localStorage fallback');";

	await replaceCodeEditorValue(page, fallbackCode);

	await expect
		.poll(() => getPersistedJavaScriptCode(page))
		.toBe(fallbackCode);

	const persistedValue = await getPersistedExplorerState(page);

	const malformedHash = await page.evaluate(key => {
		const bytes = new TextEncoder().encode("not valid persisted state");
		let binary = "";

		for (const byte of bytes) {
			binary += String.fromCharCode(byte);
		}

		const base64Url = btoa(binary)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

		const searchParams = new URLSearchParams();
		searchParams.set(key, `v2.${base64Url}`);
		return searchParams.toString();
	}, storageKey);

	await page.evaluate(
		([key, value]) => {
			window.localStorage.setItem(key, value);
		},
		[storageKey, persistedValue],
	);
	await page.goto(`/#${malformedHash}`);

	await expect(getCodeEditor(page)).toContainText(fallbackCode);
});
