/**
 * Tests for theme switching functionality.
 */

import { expect, test } from "@playwright/test";

/**
 * This test verifies that:
 * - The application shows light theme by default
 * - Users can toggle between light and dark themes
 * - Theme changes are visually reflected in the UI
 */
test("should show light theme by default and switch to dark theme", async ({
	page,
}) => {
	await page.addInitScript(() => {
		window.localStorage.setItem("vite-ui-theme", "light");
	});
	await page.goto("/");

	await expect(page.locator("html")).toContainClass("light");

	await page.getByRole("button", { name: "Toggle theme" }).click();
	await page.getByRole("menuitem", { name: "Dark" }).click();

	await expect(page.locator("html")).toContainClass("dark");
});
