/**
 * Tests for code editing functionality and AST tool interaction.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";

type HighlightSamplesState = {
	intervalId: number;
	samples: string[];
};

declare global {
	interface Window {
		__highlightSamples?: HighlightSamplesState;
	}
}

async function initCodeEditor(page: Page): Promise<Locator> {
	// focus code editor textbox
	const codeEditor = page
		.getByRole("region", { name: "Code Editor Panel" })
		.getByRole("textbox")
		.nth(1);

	// delete the default code
	await codeEditor.click();
	await codeEditor.press("ControlOrMeta+KeyA");
	await codeEditor.press("Backspace");

	return codeEditor;
}

async function replaceESQuerySelector(
	page: Page,
	selector: string,
): Promise<void> {
	page.getByRole("textbox", { name: "ESQuery Selector" }).fill(selector);
}

/*

async function switchToMarkdown(page: Page) {
	await page.getByRole("button", { name: "Language Options" }).click();
	await page.getByRole("combobox", { exact: true, name: "Language" }).click();
	await page.getByRole("option", { exact: true, name: "Markdown" }).click();
	await expect(
		page.getByRole("combobox", { exact: true, name: "Language" }),
	).toHaveText("Markdown");
	await page.keyboard.press("Escape");
}

async function enableMarkdownMath(page: Page) {
	await page.getByRole("button", { name: "Language Options" }).click();
	const mathSwitch = page.getByRole("switch", {
		exact: true,
		name: "Math",
	});
	await expect(mathSwitch).toHaveAttribute("aria-checked", "false");
	await mathSwitch.click();
	await expect(mathSwitch).toHaveAttribute("aria-checked", "true");
	await page.keyboard.press("Escape");
}

*/

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

	const codeEditor = await initCodeEditor(page);

	// add new code
	await codeEditor.pressSequentially("console.log('Hello, World!');");

	// add an ESQuery selector
	await replaceESQuerySelector(page, "CallExpression");

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

	const codeEditor = await initCodeEditor(page);

	// add new code
	await codeEditor.pressSequentially("42;");

	// add an ESQuery selector
	await replaceESQuerySelector(page, "Literal");

	const highlight = page.locator(".bg-editorHighlightedRangeColor");

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

/*

test(`should parse inline Markdown math when Math is enabled`, async ({
	page,
}) => {
	await page.goto("/");
	await switchToMarkdown(page);
	await replaceCodeEditorValue(page, "Inline $x^2$ math");

	const analysisPanel = page.getByRole("region", {
		name: "Code Analysis Tools Panel",
	});
	await analysisPanel.getByRole("radio", { name: "JSON" }).click();
	const astJson = analysisPanel.locator(".cm-content");

	await expect(astJson).toContainText("Inline $x^2$ math");
	await expect(astJson).not.toContainText(`"type": "inlineMath"`);

	await enableMarkdownMath(page);

	await expect(astJson).toContainText(`"type": "inlineMath"`);
	await expect(astJson).toContainText(`"value": "x^2"`);
});

test(`should parse block Markdown math when Math is enabled`, async ({
	page,
}) => {
	await page.goto("/");
	await switchToMarkdown(page);
	await replaceCodeEditorValue(page, "$$\nx^2\n$$");

	const analysisPanel = page.getByRole("region", {
		name: "Code Analysis Tools Panel",
	});
	await analysisPanel.getByRole("radio", { name: "JSON" }).click();
	const astJson = analysisPanel.locator(".cm-content");

	await expect(astJson).toContainText("$$");
	await expect(astJson).toContainText("x^2");
	await expect(astJson).not.toContainText(`"type": "math"`);

	await enableMarkdownMath(page);

	await expect(astJson).toContainText(`"type": "math"`);
	await expect(astJson).toContainText(`"value": "x^2"`);
});

*/
