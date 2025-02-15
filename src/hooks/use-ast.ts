import * as espree from "espree";
import type { Node as EstreeNode } from "estree";
import css from "@eslint/css";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import esquery from "esquery";
import { useExplorer } from "@/hooks/use-explorer";

export function useAST() {
	const {
		language,
		code,
		jsOptions,
		cssOptions,
		jsonOptions,
		markdownOptions,
		esquerySelector,
	} = useExplorer();

	let astParseResult:
		| { ok: true; ast: unknown }
		| { ok: false; errors: Array<unknown> };

	switch (language) {
		case "javascript": {
			try {
				const ast = espree.parse(code.javascript, {
					ecmaVersion: jsOptions.esVersion,
					sourceType: jsOptions.sourceType,
					ecmaFeatures: {
						jsx: jsOptions.isJSX,
					},
				});
				astParseResult = { ast, ok: true };
			} catch (err) {
				// error occured e.g. because the JS code cannot be parsed into an AST, or the esquery selector is no valid selector --> just ignore (no highlighted ranges)
				astParseResult = { ok: false, errors: [err] };
			}
			break;
		}

		case "json": {
			const { jsonMode } = jsonOptions;
			const language = json.languages[jsonMode];
			astParseResult = language.parse({ body: code.json });
			break;
		}

		case "markdown": {
			const { markdownMode } = markdownOptions;
			const language = markdown.languages[markdownMode];
			astParseResult = language.parse({ body: code.markdown });
			break;
		}

		case "css": {
			const { cssMode, tolerant } = cssOptions;
			const language = css.languages[cssMode];
			astParseResult = language.parse(
				{ body: code.css },
				{ languageOptions: { tolerant } },
			);
			break;
		}
	}

	if (astParseResult.ok) {
		let esqueryMatchedNodes: unknown[] = [];

		if (esquerySelector.enabled) {
			esqueryMatchedNodes = getEsqueryMatchedNodes(
				astParseResult.ast,
				esquerySelector.selector,
			);
		}

		return {
			...astParseResult,
			esqueryMatchedNodes,
		};
	} else {
		return astParseResult;
	}
}

function getEsqueryMatchedNodes(
	ast: unknown,
	esquerySelector: string | undefined,
) {
	if (esquerySelector) {
		try {
			const esqueryMatchedNodes = esquery.match(
				ast as EstreeNode,
				esquery.parse(esquerySelector),
			) as unknown[];
			return esqueryMatchedNodes;
		} catch {
			// error occured e.g. because the esquery selector is no valid selector --> just ignore (no highlighted ranges)
		}
	}
	return [];
}
