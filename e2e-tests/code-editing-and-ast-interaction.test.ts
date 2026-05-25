/**
 * @fileoverview Tests for code editing functionality and AST tool interaction.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { expect, test } from "@playwright/test";

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

	test.describe("Language: JavaScript", () => {});

	test.describe("Language: JSON", () => {});

	test.describe("Language: Markdown", () => {
		test.beforeEach(async ({ page }) => {
			// `Language`: select `Markdown`
			await page
				.getByRole("combobox", { exact: true, name: "Language" })
				.click();
			await page
				.getByRole("option", { exact: true, name: "Markdown" })
				.click();
		});

		test("Mode: CommonMark", async ({ page }) => {
			// `Mode`: `CommonMark`
			const modeSelect = page.getByRole("combobox", {
				exact: true,
				name: "Mode",
			});
			await modeSelect.click();
			await page
				.getByRole("option", { exact: true, name: "CommonMark" })
				.click();
			await expect(modeSelect).toHaveText("CommonMark");

			// `Front Matter`: `Off`
			const frontMatterSelect = page.getByRole("combobox", {
				exact: true,
				name: "Front Matter",
			});
			await frontMatterSelect.click();
			await page
				.getByRole("option", { exact: true, name: "Off" })
				.click();
			await expect(frontMatterSelect).toHaveText("Off");

			// `Math`: `false`
			const mathSwitch = page.getByRole("switch", {
				exact: true,
				name: "Math",
			});
			await expect(mathSwitch).toHaveAttribute("aria-checked", "false");

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
			const modeSelect = page.getByRole("combobox", {
				exact: true,
				name: "Mode",
			});
			await modeSelect.click();
			await page
				.getByRole("option", { exact: true, name: "GitHub-Flavored" })
				.click();
			await expect(modeSelect).toHaveText("GitHub-Flavored");

			// `Front Matter`: `Off`
			const frontMatterSelect = page.getByRole("combobox", {
				exact: true,
				name: "Front Matter",
			});
			await frontMatterSelect.click();
			await page
				.getByRole("option", { exact: true, name: "Off" })
				.click();
			await expect(frontMatterSelect).toHaveText("Off");

			// `Math`: `false`
			const mathSwitch = page.getByRole("switch", {
				exact: true,
				name: "Math",
			});
			await expect(mathSwitch).toHaveAttribute("aria-checked", "false");

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
			const modeSelect = page.getByRole("combobox", {
				exact: true,
				name: "Mode",
			});
			await modeSelect.click();
			await page
				.getByRole("option", { exact: true, name: "CommonMark" })
				.click();
			await expect(modeSelect).toHaveText("CommonMark");

			// `Front Matter`: `YAML`
			const frontMatterSelect = page.getByRole("combobox", {
				exact: true,
				name: "Front Matter",
			});
			await frontMatterSelect.click();
			await page
				.getByRole("option", { exact: true, name: "YAML" })
				.click();
			await expect(frontMatterSelect).toHaveText("YAML");

			// `Math`: `false`
			const mathSwitch = page.getByRole("switch", {
				exact: true,
				name: "Math",
			});
			await expect(mathSwitch).toHaveAttribute("aria-checked", "false");

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
			const modeSelect = page.getByRole("combobox", {
				exact: true,
				name: "Mode",
			});
			await modeSelect.click();
			await page
				.getByRole("option", { exact: true, name: "CommonMark" })
				.click();
			await expect(modeSelect).toHaveText("CommonMark");

			// `Front Matter`: `TOML`
			const frontMatterSelect = page.getByRole("combobox", {
				exact: true,
				name: "Front Matter",
			});
			await frontMatterSelect.click();
			await page
				.getByRole("option", { exact: true, name: "TOML" })
				.click();
			await expect(frontMatterSelect).toHaveText("TOML");

			// `Math`: `false`
			const mathSwitch = page.getByRole("switch", {
				exact: true,
				name: "Math",
			});
			await expect(mathSwitch).toHaveAttribute("aria-checked", "false");

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
			const modeSelect = page.getByRole("combobox", {
				exact: true,
				name: "Mode",
			});
			await modeSelect.click();
			await page
				.getByRole("option", { exact: true, name: "CommonMark" })
				.click();
			await expect(modeSelect).toHaveText("CommonMark");

			// `Front Matter`: `JSON`
			const frontMatterSelect = page.getByRole("combobox", {
				exact: true,
				name: "Front Matter",
			});
			await frontMatterSelect.click();
			await page
				.getByRole("option", { exact: true, name: "JSON" })
				.click();
			await expect(frontMatterSelect).toHaveText("JSON");

			// `Math`: `false`
			const mathSwitch = page.getByRole("switch", {
				exact: true,
				name: "Math",
			});
			await expect(mathSwitch).toHaveAttribute("aria-checked", "false");

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
	});

	test.describe("Language: CSS", () => {});

	test.describe("Language: HTML", () => {});
});
