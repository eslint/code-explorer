/**
 * Tests for the Code Analysis Tools Panel.
 */
import { test, expect } from "@playwright/test";

/**
 * This test verifies that:
 * - Users can switch between different code analysis tools (AST, Scope, Code Path)
 * - Each tool displays correctly
 * - Tool-specific interactions work as expected (e.g. scope selection)
 */
test("should switch to each tool and show it", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("region", { name: "Code Analysis Tools Panel" }),
	).toHaveScreenshot("tools-ast.png");

	await page.getByRole("button", { name: "Scope" }).click();
	await page.getByRole("button", { name: "global" }).click();
	// move mouse away to avoid accordion hover state
	await page.mouse.move(0, 0);

	await expect(
		page.getByRole("region", { name: "Code Analysis Tools Panel" }),
	).toHaveScreenshot("tools-scope.png");

	await page.getByRole("button", { name: "Code Path" }).click();

	await expect(
		page.getByRole("region", { name: "Code Analysis Tools Panel" }),
	).toHaveScreenshot("tools-code-path.png");
});
