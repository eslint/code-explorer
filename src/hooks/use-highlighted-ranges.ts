import esquery from "esquery";
import type { Node as EstreeNode } from "estree";
import { useAST } from "@/hooks/use-ast";
import { useExplorer } from "@/hooks/use-explorer";
import type { HighlightedRange } from "@/utils/highlighted-ranges";
import { assert } from "@/lib/utils";

export function useHighlightedRanges() {
	const result = useAST();
	const { jsOptions, esquerySelector } = useExplorer();

	let highlightedRanges: HighlightedRange[] = [];
	if (jsOptions.esquerySelectorEnabled && result.ok) {
		try {
			const esqueryMatchedNodes = esquery.match(
				result.ast as EstreeNode,
				esquery.parse(esquerySelector),
			) as unknown[];
			highlightedRanges = esqueryMatchedNodes.map(node => {
				assert(typeof node === "object" && node !== null);
				if (isNodeWithPosition(node)) {
					return [
						node.position.start.offset,
						node.position.end.offset,
					];
				}
				assert(
					"start" in node &&
						typeof node.start === "number" &&
						"end" in node &&
						typeof node.end === "number",
				);
				return [node.start, node.end];
			});
		} catch {
			// error occured e.g. because the esquery selector is no valid selector --> just ignore (no highlighted ranges)
		}
	}

	return highlightedRanges;
}

type NodeWithPosition = {
	position: { start: PositionElem; end: PositionElem };
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
