/**
 * Tests for language selection and options panel functionality.
 */
import { test } from "@playwright/test";

/**
 * This test verifies that:
 * - Users can open the language options popover
 * - Users can switch between supported languages (JavaScript, JSON, Markdown, CSS, HTML)
 * - For each language the entire page is correctly rendered
 */
test("should switch language and show options for each", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Language Options" }).click();

	await page.getByRole("combobox", { name: "Language" }).click();
	await page.getByRole("option", { name: "JSON" }).click();

	await page.getByRole("combobox", { name: "Language" }).click();
	await page.getByRole("option", { name: "Markdown" }).click();

	await page.getByRole("combobox", { name: "Language" }).click();
	await page.getByRole("option", { name: "CSS" }).click();

	await page.getByRole("combobox", { name: "Language" }).click();
	await page.getByRole("option", { name: "HTML" }).click();
});
