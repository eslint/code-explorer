/**
 * Tests for theme switching functionality.
 */

import { test, expect } from "@playwright/test";

/**
 * This test verifies that:
 * - The application shows light theme by default
 * - Users can toggle between light and dark themes
 * - Theme changes are visually reflected in the UI
 */
test("should show light theme by default and switch to dark theme", async ({
	page,
}) => {
	await page.goto("/");

	await expect(page).toHaveScreenshot("light-theme.png");

	await page.getByRole("button", { name: "Toggle theme" }).click();
	await page.getByRole("menuitem", { name: "Dark" }).click();

	await expect(page).toHaveScreenshot("dark-theme.png");
});
