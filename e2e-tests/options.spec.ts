/**
 * Tests for language selection and options panel functionality.
 */
import { test, expect } from "@playwright/test";

/**
 * This test verifies that:
 * - Users can open the language options popover
 * - Users can switch between supported languages (JavaScript, JSON, Markdown, CSS)
 * - For each language the entire page is correctly rendered
 */
test("should switch language and show options for each", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Language Options" }).click();

	await expect(page).toHaveScreenshot("page-javascript.png");

	await page.getByRole("combobox", { name: "Language" }).click();
	await page.getByRole("option", { name: "JSON JSON" }).click();

	await expect(page).toHaveScreenshot("page-json.png");

	await page.getByRole("combobox", { name: "Language" }).click();
	await page.getByRole("option", { name: "Markdown Markdown" }).click();

	await expect(page).toHaveScreenshot("page-markdown.png");

	await page.getByRole("combobox", { name: "Language" }).click();
	await page.getByRole("option", { name: "CSS CSS" }).click();

	await expect(page).toHaveScreenshot("page-css.png");
});
