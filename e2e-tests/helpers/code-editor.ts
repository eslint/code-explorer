import type { Page } from "@playwright/test";

export function getCodeEditor(page: Page) {
	return page
		.getByRole("region", { name: "Code Editor Panel" })
		.getByRole("textbox")
		.last();
}

export async function replaceCodeEditorValue(page: Page, value: string) {
	const codeEditor = getCodeEditor(page);

	await codeEditor.fill(value);
}
