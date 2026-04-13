/**
 * @fileoverview Tests for language selection and options panel functionality.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { expect, test } from "@playwright/test";

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

/**
 * This test verifies that:
 * - Users can open the language options popover
 * - Users can switch between supported languages (JavaScript, JSON, Markdown, CSS, HTML)
 * - For each language the entire page is correctly rendered
 */
test("should switch language and show options for each", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Language Options" }).click();

	const languageSelect = page.getByRole("combobox", { name: "Language" });

	// JavaScript
	await test.step("should show JavaScript options when JavaScript is selected", async () => {
		await languageSelect.click();
		await page
			.getByRole("option", { exact: true, name: "JavaScript" })
			.click();

		// `Language` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Language" }),
		).toHaveText("JavaScript");

		// `Parser` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Parser" }),
		).toHaveText("Espree");

		// `Source Type` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Source Type" }),
		).toHaveText("Module");

		// `ECMAScript Version` Combobox
		await expect(
			page.getByRole("combobox", {
				exact: true,
				name: "ECMAScript Version",
			}),
		).toHaveText("Latest");

		// `JSX` Switch
		await expect(
			page.getByRole("switch", {
				exact: true,
				name: "JSX",
			}),
		).toBeVisible();
	});

	// JSON
	await test.step("should show JSON options when JSON is selected", async () => {
		await languageSelect.click();
		await page.getByRole("option", { exact: true, name: "JSON" }).click();

		// `Language` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Language" }),
		).toHaveText("JSON");

		// `Mode` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Mode" }),
		).toHaveText("jsonc");

		// `Allow Trailing Commas` Switch
		await expect(
			page.getByRole("switch", {
				exact: true,
				name: "Allow Trailing Commas",
			}),
		).toBeVisible();
	});

	// Markdown
	await test.step("should show Markdown options when Markdown is selected", async () => {
		await languageSelect.click();
		await page
			.getByRole("option", { exact: true, name: "Markdown" })
			.click();

		// `Language` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Language" }),
		).toHaveText("Markdown");

		// `Mode` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Mode" }),
		).toHaveText("CommonMark");

		// `Front Matter` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Front Matter" }),
		).toBeVisible();
	});

	// CSS
	await test.step("should show CSS options when CSS is selected", async () => {
		await languageSelect.click();
		await page.getByRole("option", { exact: true, name: "CSS" }).click();

		// `Language` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Language" }),
		).toHaveText("CSS");

		// `Tolerant Parsing` Switch
		await expect(
			page.getByRole("switch", { exact: true, name: "Tolerant Parsing" }),
		).toBeVisible();
	});

	// HTML
	await test.step("should show HTML options when HTML is selected", async () => {
		await languageSelect.click();
		await page.getByRole("option", { exact: true, name: "HTML" }).click();

		// `Language` Combobox
		await expect(
			page.getByRole("combobox", { exact: true, name: "Language" }),
		).toHaveText("HTML");

		// `Template Engine Syntax` Combobox
		await expect(
			page.getByRole("combobox", {
				exact: true,
				name: "Template Engine Syntax",
			}),
		).toBeVisible();

		// `Front Matter` Switch
		await expect(
			page.getByRole("switch", {
				exact: true,
				name: "Front Matter",
			}),
		).toBeVisible();
	});
});
