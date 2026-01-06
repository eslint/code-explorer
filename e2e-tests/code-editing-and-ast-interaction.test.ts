/**
 * Tests for code editing functionality and AST tool interaction.
 */
import test, { expect } from "@playwright/test";

/**
 * This test verifies that:
 * - Users can edit code in the editor
 * - The AST updates in response to code changes
 * - ESQuery selectors correctly highlight matching code and AST nodes
 * - AST node expansion functionality works properly
 */
test(`should change code, then highlight code and AST nodes matching ESQuery selector`, async ({
	page,
}) => {
	await page.goto("/");

	// focus code editor textbox
	await page
		.getByRole("region", { name: "Code Editor Panel" })
		.getByRole("textbox")
		.nth(1)
		.click();

	// delete the default code
	await page.keyboard.press("ControlOrMeta+KeyA");
	await page.keyboard.press("Backspace");

	// add new code
	await page.keyboard.type("console.log('Hello, World!');");

	// add an ESQuery selector
	await page.getByRole("textbox", { name: "ESQuery Selector" }).click();
	await page.keyboard.type("CallExpression");

	// wait for the debounced update of the AST to happen
	await expect(
		page
			.getByRole("listitem")
			.filter({ hasText: "end" })
			.filter({ hasText: "29" }),
	).toBeVisible();

	// expand AST nodes for ExpressionStatement and CallExpression
	await page
		.getByRole("region", { name: "Program" })
		.getByRole("listitem")
		.filter({ hasText: "bodyArray[1 element]" })
		.getByLabel("Toggle Property")
		.click();
	await page.getByRole("button", { name: "ExpressionStatement" }).click();
	await page
		.getByRole("region", { name: "Program" })
		.getByRole("listitem")
		.filter({ hasText: "expressionCallExpression{type" })
		.getByLabel("Toggle Property")
		.click();
});
