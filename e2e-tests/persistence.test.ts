import { expect, test, type Page } from "@playwright/test";

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

async function replaceEditorValue(page: Page, value: string) {
	const codeEditor = page
		.getByRole("region", { name: "Code Editor Panel" })
		.getByRole("textbox")
		.nth(1);

	await codeEditor.click();
	await codeEditor.press("ControlOrMeta+KeyA");
	await codeEditor.press("Backspace");
	await codeEditor.pressSequentially(value);
}

test("should persist unicode code safely in the URL hash", async ({ page }) => {
	await page.addInitScript(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto("/");

	const unicodeCode = 'const \u03C0 = "\u{1F600}";';

	await replaceEditorValue(page, unicodeCode);

	await expect.poll(() => getPersistedJavaScriptCode(page)).toBe(unicodeCode);
	await expect.poll(() => getStoredHashValue(page)).toContain("v2.");

	const persistedHash = await page.evaluate(() => window.location.hash);

	await page.evaluate(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto(`/${persistedHash}`);

	await expect(page.locator(".cm-content")).toContainText(unicodeCode);
});

test("should still load state from legacy hash links", async ({ page }) => {
	await page.addInitScript(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto("/");

	const legacyCode = "console.log('legacy hash');";

	await replaceEditorValue(page, legacyCode);

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

	await expect(page.locator(".cm-content")).toContainText(legacyCode);
});

test("should fall back to localStorage when a v2 hash is malformed", async ({
	page,
}) => {
	await page.addInitScript(key => {
		window.localStorage.removeItem(key);
	}, storageKey);
	await page.goto("/");

	const fallbackCode = "console.log('localStorage fallback');";

	await replaceEditorValue(page, fallbackCode);

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

	await expect(page.locator(".cm-content")).toContainText(fallbackCode);
});
