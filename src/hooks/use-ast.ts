import * as espree from "espree";
import type { Node as EstreeNode } from "estree";
import css from "@eslint/css";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import esquery from "esquery";
import { useExplorer } from "@/hooks/use-explorer";
import type { HighlightedRange } from "@/utils/highlighted-ranges";
import { assert } from "@/lib/utils";

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
		let highlightedRanges: HighlightedRange[] = [];

		if (esquerySelector.enabled) {
			const esqueryMatchedNodes = getEsqueryMatchedNodes(
				astParseResult.ast,
				esquerySelector.selector,
			);
			if (esqueryMatchedNodes) {
				highlightedRanges = convertNodesToRanges(esqueryMatchedNodes);
			}
		}

		return {
			...astParseResult,
			highlightedRanges,
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
}

function convertNodesToRanges(
	esqueryMatchedNodes: unknown[],
): HighlightedRange[] {
	const highlightedRanges: HighlightedRange[] = esqueryMatchedNodes.map(
		node => {
			assert(typeof node === "object" && node !== null);
			if (isNodeWithPosition(node)) {
				return [node.position.start.offset, node.position.end.offset];
			} else if (isNodeWithLoc(node)) {
				return [node.loc.start.offset, node.loc.end.offset];
			}
			assert(
				"start" in node &&
					typeof node.start === "number" &&
					"end" in node &&
					typeof node.end === "number",
			);
			return [node.start, node.end];
		},
	);

	return highlightedRanges;
}

type NodeWithPosition = {
	position: { start: PositionElem; end: PositionElem };
};

type NodeWithLoc = {
	loc: { start: PositionElem; end: PositionElem };
};

type PositionElem = {
	offset: number;
};

function isNodeWithPosition(node: unknown): node is NodeWithPosition {
	return (
		typeof node === "object" &&
		node !== null &&
		"position" in node &&
		typeof node.position === "object" &&
		node.position !== null &&
		"start" in node.position &&
		typeof node.position.start === "object" &&
		node.position.start !== null &&
		"offset" in node.position.start &&
		typeof node.position.start.offset === "number" &&
		"end" in node.position &&
		typeof node.position.end === "object" &&
		node.position.end !== null &&
		"offset" in node.position.end &&
		typeof node.position.end.offset === "number"
	);
}

function isNodeWithLoc(node: unknown): node is NodeWithLoc {
	return (
		typeof node === "object" &&
		node !== null &&
		"loc" in node &&
		typeof node.loc === "object" &&
		node.loc !== null &&
		"start" in node.loc &&
		typeof node.loc.start === "object" &&
		node.loc.start !== null &&
		"offset" in node.loc.start &&
		typeof node.loc.start.offset === "number" &&
		"end" in node.loc &&
		typeof node.loc.end === "object" &&
		node.loc.end !== null &&
		"offset" in node.loc.end &&
		typeof node.loc.end.offset === "number"
	);
}
