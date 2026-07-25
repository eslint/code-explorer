/**
 * @fileoverview Tests for code editing functionality and AST tool interaction.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { expect, test, type Page } from "@playwright/test";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

type HighlightSamplesState = {
	intervalId: number;
	samples: string[];
};

declare global {
	interface Window {
		__highlightSamples?: HighlightSamplesState;
	}
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Sets and verifies a combobox option in the language options popup.
 * @param page The current Playwright page.
 * @param name The accessible name of the option control.
 * @param value The displayed option value.
 */
async function setComboboxOption(page: Page, name: string, value: string) {
	const optionSelect = page.getByRole("combobox", { exact: true, name });
	await optionSelect.click();
	await page.getByRole("option", { exact: true, name: value }).click();
	await expect(optionSelect).toHaveText(value);
}

/**
 * Sets and verifies a switch option in the language options popup.
 * @param page The current Playwright page.
 * @param name The accessible name of the option control.
 * @param value The desired switch state.
 */
async function setSwitchOption(page: Page, name: string, value: boolean) {
	const optionSwitch = page.getByRole("switch", { exact: true, name });
	const expectedValue = String(value);

	if ((await optionSwitch.getAttribute("aria-checked")) !== expectedValue) {
		await optionSwitch.click();
	}

	await expect(optionSwitch).toHaveAttribute("aria-checked", expectedValue);
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

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

	await page
		.getByRole("textbox", { name: "Code Editor", exact: true })
		.fill("console.log('Hello, World!');");

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

	const codeEditor = page.getByRole("textbox", {
		name: "Code Editor",
		exact: true,
	});
	const highlight = codeEditor.locator(".bg-editorHighlightedRangeColor");

	await codeEditor.fill("42;");

	await page
		.getByRole("textbox", { name: "ESQuery Selector" })
		.fill("Literal");

	await expect(highlight).toHaveText(["42"]);

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
	await expect(highlight).toHaveText(["42"]);
});

test.describe("AST node expansion", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: "Language Options" }).click();
	});

	test.describe("Language: JavaScript", () => {
		test.beforeEach(async ({ page }) => {
			// `Language`: select `JavaScript`
			await setComboboxOption(page, "Language", "JavaScript");
		});

		test("SourceType: Module", async ({ page }) => {
			// `Source Type`: `Module`
			await setComboboxOption(page, "Source Type", "Module");

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a JavaScript module sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill('import x from "x";');

			// Verify that the AST structure matches expectations for module source type.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. ImportDeclaration" }),
			).toBeVisible();
		});

		test("SourceType: CommonJS", async ({ page }) => {
			// `Source Type`: `CommonJS`
			await setComboboxOption(page, "Source Type", "CommonJS");

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a CommonJS sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("return;");

			// Verify that the AST structure matches expectations for CommonJS source type.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. ReturnStatement" }),
			).toBeVisible();
		});

		test("SourceType: Script", async ({ page }) => {
			// `Source Type`: `Script`
			await setComboboxOption(page, "Source Type", "Script");

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a script sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("with (x) {}");

			// Verify that the AST structure matches expectations for script source type.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. WithStatement" }),
			).toBeVisible();
		});

		test("ECMAScript Version: 2026", async ({ page }) => {
			// `ECMAScript Version`: `2026`
			await setComboboxOption(page, "ECMAScript Version", "2026");

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a JavaScript sample with using syntax into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("using x = y;");

			// Verify that the AST structure matches expectations for using syntax.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page
				.getByRole("button", { name: "0. VariableDeclaration" })
				.click();

			await expect(
				page
					.getByRole("region", { name: "0. VariableDeclaration" })
					.getByRole("listitem")
					.filter({ hasText: "kindusing" }),
			).toBeVisible();
		});

		test("JSX: true", async ({ page }) => {
			// `JSX`: `true`
			await setSwitchOption(page, "JSX", true);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a JSX sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("<x />;");

			// Verify that the AST structure matches expectations for JSX.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page
				.getByRole("button", { name: "0. ExpressionStatement" })
				.click();

			await expect(
				page
					.getByRole("region", { name: "0. ExpressionStatement" })
					.getByRole("listitem")
					.filter({
						hasText: "expressionJSXElement{type, start, end, ...}",
					}),
			).toBeVisible();
		});
	});

	test.describe("Language: JSON", () => {
		test.beforeEach(async ({ page }) => {
			// `Language`: select `JSON`
			await setComboboxOption(page, "Language", "JSON");
		});

		test("Mode: JSON", async ({ page }) => {
			// `Mode`: `JSON`
			await setComboboxOption(page, "Mode", "json");

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a JSON sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill('{"foo":"bar"}');

			// Verify that the AST structure matches expectations for JSON.
			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "bodyObject{type, members, loc, ...}" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "membersArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Member" }),
			).toBeVisible();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "tokensArray[5 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. LBrace" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. String" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "2. Colon" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "3. String" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "4. RBrace" }),
			).toBeVisible();
		});

		test("Mode: JSONC", async ({ page }) => {
			// `Mode`: `JSONC`
			await setComboboxOption(page, "Mode", "jsonc");

			// `Allow Trailing Commas`: `false`
			await setSwitchOption(page, "Allow Trailing Commas", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a JSONC sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill('{\n// comment\n"foo":"bar"\n}');

			// Verify that the AST structure matches expectations for JSONC.
			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "bodyObject{type, members, loc, ...}" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "membersArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Member" }),
			).toBeVisible();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "tokensArray[6 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. LBrace" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. LineComment" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "2. String" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "3. Colon" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "4. String" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "5. RBrace" }),
			).toBeVisible();
		});

		test("Mode: JSON5", async ({ page }) => {
			// `Mode`: `JSON5`
			await setComboboxOption(page, "Mode", "json5");

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a JSON5 sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill('{foo:"bar",}');

			// Verify that the AST structure matches expectations for JSON5.
			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "bodyObject{type, members, loc, ...}" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "membersArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Member" }),
			).toBeVisible();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "tokensArray[6 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. LBrace" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. Identifier" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "2. Colon" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "3. String" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "4. Comma" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "5. RBrace" }),
			).toBeVisible();
		});

		test("Allow Trailing Commas: true", async ({ page }) => {
			// `Mode`: `JSONC`
			await setComboboxOption(page, "Mode", "jsonc");

			// `Allow Trailing Commas`: `true`
			await setSwitchOption(page, "Allow Trailing Commas", true);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a JSONC sample with a trailing comma into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill('{\n// comment\n"foo":"bar",\n}');

			// Verify that the AST structure matches expectations for JSONC with trailing commas.
			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "bodyObject{type, members, loc, ...}" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "membersArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Member" }),
			).toBeVisible();

			await page
				.getByRole("region", { name: "Document" })
				.getByRole("listitem")
				.filter({ hasText: "tokensArray[7 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. LBrace" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. LineComment" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "2. String" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "3. Colon" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "4. String" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "5. Comma" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "6. RBrace" }),
			).toBeVisible();
		});
	});

	test.describe("Language: Markdown", () => {
		test.beforeEach(async ({ page }) => {
			// `Language`: select `Markdown`
			await setComboboxOption(page, "Language", "Markdown");
		});

		test("Mode: CommonMark", async ({ page }) => {
			// `Mode`: `CommonMark`
			await setComboboxOption(page, "Mode", "CommonMark");

			// `Front Matter`: `Off`
			await setComboboxOption(page, "Front Matter", "Off");

			// `Math`: `false`
			await setSwitchOption(page, "Math", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a CommonMark sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("text, *emphasis*, **strong**");

			// Verify that the AST structure matches expectations for CommonMark.
			await page
				.getByRole("region", { name: "root" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. paragraph" }).click();

			await page
				.getByRole("region", { name: "0. paragraph" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[4 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. text" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. emphasis" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "2. text" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "3. strong" }),
			).toBeVisible();
		});

		test("Mode: GFM", async ({ page }) => {
			// `Mode`: `GFM`
			await setComboboxOption(page, "Mode", "GitHub-Flavored");

			// `Front Matter`: `Off`
			await setComboboxOption(page, "Front Matter", "Off");

			// `Math`: `false`
			await setSwitchOption(page, "Math", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a GFM sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("text, ~~delete~~, *emphasis*");

			// Verify that the AST structure matches expectations for GFM.
			await page
				.getByRole("region", { name: "root" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. paragraph" }).click();

			await page
				.getByRole("region", { name: "0. paragraph" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[4 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. text" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. delete" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "2. text" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "3. emphasis" }),
			).toBeVisible();
		});

		test("Frontmatter: YAML", async ({ page }) => {
			// `Mode`: `CommonMark`
			await setComboboxOption(page, "Mode", "CommonMark");

			// `Front Matter`: `YAML`
			await setComboboxOption(page, "Front Matter", "YAML");

			// `Math`: `false`
			await setSwitchOption(page, "Math", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a Markdown sample with YAML frontmatter into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("---\ntitle: Test\n---\n\ntext");

			// Verify that the AST structure matches expectations for YAML frontmatter.
			await page
				.getByRole("region", { name: "root" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[2 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. yaml" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. paragraph" }),
			).toBeVisible();
		});

		test("Frontmatter: TOML", async ({ page }) => {
			// `Mode`: `CommonMark`
			await setComboboxOption(page, "Mode", "CommonMark");

			// `Front Matter`: `TOML`
			await setComboboxOption(page, "Front Matter", "TOML");

			// `Math`: `false`
			await setSwitchOption(page, "Math", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a Markdown sample with TOML frontmatter into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("+++\ncount = 1\n+++\n\ntext");

			// Verify that the AST structure matches expectations for TOML frontmatter.
			await page
				.getByRole("region", { name: "root" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[2 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. toml" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. paragraph" }),
			).toBeVisible();
		});

		test("Frontmatter: JSON", async ({ page }) => {
			// `Mode`: `CommonMark`
			await setComboboxOption(page, "Mode", "CommonMark");

			// `Front Matter`: `JSON`
			await setComboboxOption(page, "Front Matter", "JSON");

			// `Math`: `false`
			await setSwitchOption(page, "Math", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a Markdown sample with JSON frontmatter into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill('---\n{"count":1}\n---\n\ntext');

			// Verify that the AST structure matches expectations for JSON frontmatter.
			await page
				.getByRole("region", { name: "root" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[2 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. json" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. paragraph" }),
			).toBeVisible();
		});

		test("Math: true", async ({ page }) => {
			// `Mode`: `CommonMark`
			await setComboboxOption(page, "Mode", "CommonMark");

			// `Front Matter`: `Off`
			await setComboboxOption(page, "Front Matter", "Off");

			// `Math`: `true`
			await setSwitchOption(page, "Math", true);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a Markdown sample with inline and block math into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("inline $x + y$ math\n\n$$\nx + y\n$$");

			// Verify that the AST structure matches expectations for math.
			await page
				.getByRole("region", { name: "root" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[2 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. paragraph" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. math" }),
			).toBeVisible();

			await page.getByRole("button", { name: "0. paragraph" }).click();

			await page
				.getByRole("region", { name: "0. paragraph" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[3 elements]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. text" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "1. inlineMath" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "2. text" }),
			).toBeVisible();
		});
	});

	test.describe("Language: CSS", () => {
		test.beforeEach(async ({ page }) => {
			// `Language`: select `CSS`
			await setComboboxOption(page, "Language", "CSS");
		});

		test("Tolerant Parsing: false", async ({ page }) => {
			// `Tolerant Parsing`: `false`
			await setSwitchOption(page, "Tolerant Parsing", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a CSS sample into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("a{}");

			// Verify that the AST structure matches expectations for CSS.
			await page
				.getByRole("region", { name: "StyleSheet" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Rule" }),
			).toBeVisible();
		});

		test("Tolerant Parsing: true", async ({ page }) => {
			// `Tolerant Parsing`: `true`
			await setSwitchOption(page, "Tolerant Parsing", true);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill a CSS sample that requires tolerant parsing into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("a{");

			// Verify that the AST structure matches expectations for tolerant CSS.
			await page
				.getByRole("region", { name: "StyleSheet" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Rule" }),
			).toBeVisible();
		});
	});

	test.describe("Language: HTML", () => {
		test.beforeEach(async ({ page }) => {
			// `Language`: select `HTML`
			await setComboboxOption(page, "Language", "HTML");
		});

		test("Template Engine Syntax: Handlebars", async ({ page }) => {
			// `Template Engine Syntax`: `Handlebars`
			await setComboboxOption(
				page,
				"Template Engine Syntax",
				"Handlebars",
			);

			// `Front Matter`: `false`
			await setSwitchOption(page, "Front Matter", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill an HTML sample with Handlebars syntax into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("<p>{{x}}</p>");

			// Verify that the AST structure matches expectations for Handlebars syntax.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Document" }).click();

			await page
				.getByRole("region", { name: "0. Document" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Tag" }).click();

			await page
				.getByRole("region", { name: "0. Tag" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Text" }).click();

			await page
				.getByRole("region", { name: "0. Text" })
				.getByRole("listitem")
				.filter({ hasText: "partsArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Template" }),
			).toBeVisible();
		});

		test("Template Engine Syntax: Twig", async ({ page }) => {
			// `Template Engine Syntax`: `Twig`
			await setComboboxOption(page, "Template Engine Syntax", "Twig");

			// `Front Matter`: `false`
			await setSwitchOption(page, "Front Matter", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill an HTML sample with Twig syntax into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("<p>{%x%}</p>");

			// Verify that the AST structure matches expectations for Twig syntax.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Document" }).click();

			await page
				.getByRole("region", { name: "0. Document" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Tag" }).click();

			await page
				.getByRole("region", { name: "0. Tag" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Text" }).click();

			await page
				.getByRole("region", { name: "0. Text" })
				.getByRole("listitem")
				.filter({ hasText: "partsArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Template" }),
			).toBeVisible();
		});

		test("Template Engine Syntax: ERB", async ({ page }) => {
			// `Template Engine Syntax`: `ERB`
			await setComboboxOption(page, "Template Engine Syntax", "ERB");

			// `Front Matter`: `false`
			await setSwitchOption(page, "Front Matter", false);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill an HTML sample with ERB syntax into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("<p><%x%></p>");

			// Verify that the AST structure matches expectations for ERB syntax.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Document" }).click();

			await page
				.getByRole("region", { name: "0. Document" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Tag" }).click();

			await page
				.getByRole("region", { name: "0. Tag" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Text" }).click();

			await page
				.getByRole("region", { name: "0. Text" })
				.getByRole("listitem")
				.filter({ hasText: "partsArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Template" }),
			).toBeVisible();
		});

		test("Front Matter: true", async ({ page }) => {
			// `Template Engine Syntax`: `None`
			const templateEngineSyntaxSelect = page.getByRole("combobox", {
				exact: true,
				name: "Template Engine Syntax",
			});
			await expect(templateEngineSyntaxSelect).toHaveText("None");

			// `Front Matter`: `true`
			await setSwitchOption(page, "Front Matter", true);

			// Hide the settings menu to ensure it doesn't interfere with the test.
			await page.keyboard.press("Escape");

			// Fill an HTML sample with front matter into the editor.
			await page
				.getByRole("textbox", { exact: true, name: "Code Editor" })
				.fill("---\ntitle: Test\n---\n<p>x</p>");

			// Verify that the AST structure matches expectations for HTML front matter.
			await page
				.getByRole("region", { name: "Program" })
				.getByRole("listitem")
				.filter({ hasText: "bodyArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await page.getByRole("button", { name: "0. Document" }).click();

			await page
				.getByRole("region", { name: "0. Document" })
				.getByRole("listitem")
				.filter({ hasText: "childrenArray[1 element]" })
				.getByRole("button", { name: "Toggle Property" })
				.click();

			await expect(
				page.getByRole("button", { name: "0. Tag" }),
			).toBeVisible();
		});
	});
});
