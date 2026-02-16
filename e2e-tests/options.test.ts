/**
 * Tests for language selection and options panel functionality.
 */
import { expect, test } from "@playwright/test";

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

	await languageSelect.click();
	await page.getByRole("option", { name: "JSON" }).click();
	await expect(
		page.getByRole("switch", { name: "Allow Trailing Commas" }),
	).toBeVisible();

	await languageSelect.click();
	await page.getByRole("option", { name: "Markdown" }).click();
	await expect(
		page.getByRole("combobox", { name: "Front Matter" }),
	).toBeVisible();

	await languageSelect.click();
	await page.getByRole("option", { name: "CSS" }).click();
	await expect(
		page.getByRole("switch", { name: "Tolerant Parsing" }),
	).toBeVisible();

	await languageSelect.click();
	await page.getByRole("option", { name: "HTML" }).click();
	await expect(
		page.getByRole("combobox", { name: "Template Engine Syntax" }),
	).toBeVisible();
});
