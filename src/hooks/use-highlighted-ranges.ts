import esquery from "esquery";
import { Node } from "acorn";
import type { Node as EstreeNode } from "estree";
import { useExplorer } from "@/hooks/use-explorer";
import { parseJavascriptAST } from "@/lib/parse-javascript-ast";
import type { HighlightedRange } from "@/utils/highlighted-ranges";

export function useHighlightedRanges() {
	const { language, code, jsOptions, esquerySelector } = useExplorer();

	let highlightedRanges: HighlightedRange[] = [];
	if (language === "javascript" && jsOptions.esquerySelectorEnabled) {
		try {
			const tree = parseJavascriptAST({
				code: code.javascript,
				jsOptions: jsOptions,
			});
			/**
			 * "esquery" uses type "Node" of "@types/estree", "espree" returns  "Node" of "acorn"
			 * but they are compatible
			 * Therefore, cast between "Node" of "acorn" and "Node" of "@types/estree"
			 */
			const esqueryMatchedNodes = esquery.match(
				tree as EstreeNode,
				esquery.parse(esquerySelector),
			) as Node[];
			highlightedRanges = esqueryMatchedNodes.map(node => [
				node.start,
				node.end,
			]);
		} catch {
			// error occured e.g. because the JS code cannot be parsed into an AST, or the esquery selector is no valid selector --> just ignore (no highlighted ranges)
		}
	}

	return highlightedRanges;
}
