/**
 * @fileoverview Tests for the Code Analysis Tools Panel.
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
 * - Users can switch between different code analysis tools (AST, Scope, Code Path)
 * - Each tool displays correctly
 * - Tool-specific interactions work as expected (e.g. scope selection)
 */
test("should switch to each tool and show it", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Scope" }).click();
	const globalScopeButton = page.getByRole("button", { name: "global" });

	await expect(globalScopeButton).toHaveAttribute("aria-expanded", "false");
	await globalScopeButton.click();
	await expect(globalScopeButton).toHaveAttribute("aria-expanded", "true");

	await page.getByRole("button", { name: "Code Path" }).click();
	await expect(page.getByTestId("rf__background")).toBeVisible();
});

test("should display variables in the scope set", async ({ page }) => {
	await page.goto("/");
	await page
		.getByRole("textbox", { name: "Code Editor", exact: true })
		.fill("const __x = 1;");
	await page.getByRole("button", { name: "Scope", exact: true }).click();
	await page.getByRole("button", { name: "2. module", exact: true }).click();

	const moduleScope = page.getByRole("region", { name: "2. module" });
	const setEntry = moduleScope
		.getByRole("listitem")
		.filter({ hasText: /^setMap\(1\)$/ });
	await expect(setEntry).toBeVisible();
	await setEntry.getByRole("button", { name: "set", exact: true }).click();
	await moduleScope.getByRole("button", { name: "__x", exact: true }).click();
	await expect(
		moduleScope.getByRole("listitem").filter({ hasText: /^name__x$/ }),
	).toBeVisible();
});
