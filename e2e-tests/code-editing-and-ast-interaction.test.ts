/**
 * Tests for code editing functionality and AST tool interaction.
 */
import { expect, test } from "@playwright/test";

type HighlightSamplesState = {
	intervalId: number;
	samples: string[];
};

declare global {
	interface Window {
		__highlightSamples?: HighlightSamplesState;
	}
}

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
		.getByRole("button", { name: "Toggle Property" })
		.click();
	await page.getByRole("button", { name: "ExpressionStatement" }).click();
	await page
		.getByRole("region", { name: "Program" })
		.getByRole("listitem")
		.filter({ hasText: "expressionCallExpression{type" })
		.getByRole("button", { name: "Toggle Property" })
		.click();
});

test(`should keep ESQuery highlights aligned while typing before a matching literal`, async ({
	page,
}) => {
	await page.goto("/");

	const codeEditor = page
		.getByRole("region", { name: "Code Editor Panel" })
		.getByRole("textbox")
		.nth(1);
	const highlight = page.locator(".bg-editorHighlightedRangeColor");

	await codeEditor.click();
	await codeEditor.press("ControlOrMeta+KeyA");
	await codeEditor.press("Backspace");
	await codeEditor.pressSequentially("42;");

	await page
		.getByRole("textbox", { name: "ESQuery Selector" })
		.fill("Literal");

	await expect(highlight).toHaveText("42");

	await codeEditor.click();
	await codeEditor.press("Home");
	await page.evaluate(() => {
		window.__highlightSamples = {
			intervalId: window.setInterval(() => {
				window.__highlightSamples?.samples.push(
					Array.from(
						document.querySelectorAll(
							".bg-editorHighlightedRangeColor",
						),
					)
						.map(node => node.textContent ?? "")
						.join(""),
				);
			}, 20),
			samples: [],
		};
	});
	await codeEditor.pressSequentially("+ + + +", { delay: 50 });

	const highlightSamples = await page.evaluate(() => {
		const highlightSamples = window.__highlightSamples?.samples ?? [];

		if (window.__highlightSamples) {
			window.clearInterval(window.__highlightSamples.intervalId);
			delete window.__highlightSamples;
		}

		return highlightSamples;
	});

	expect(highlightSamples.length).toBeGreaterThan(0);
	expect(
		highlightSamples.every(highlightText => highlightText === "42"),
	).toBe(true);
	await expect(highlight).toHaveText("42");
});

// TODO: Add tests for verifying Math parsing option in Markdown.
