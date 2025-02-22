import type { HighlightedRange } from "@/utils/highlighted-ranges";

export function convertNodesToRanges(
	esqueryMatchedNodes: unknown[],
): HighlightedRange[] {
	const highlightedRanges: HighlightedRange[] = esqueryMatchedNodes
		.map(node => {
			if (isNodeWithStartEnd(node)) {
				return [node.start, node.end] satisfies HighlightedRange;
			}
			if (isNodeWithPosition(node)) {
				return [
					node.position.start.offset,
					node.position.end.offset,
				] satisfies HighlightedRange;
			} else if (isNodeWithLoc(node)) {
				return [
					node.loc.start.offset,
					node.loc.end.offset,
				] satisfies HighlightedRange;
			}
		})
		.filter(range => range !== undefined);

	return highlightedRanges;
}

type NodeWithStartEnd = {
	start: number;
	end: number;
};

type NodeWithPosition = {
	position: { start: PositionElem; end: PositionElem };
};

type NodeWithLoc = {
	loc: { start: PositionElem; end: PositionElem };
};

type PositionElem = {
	offset: number;
};

function isNodeWithStartEnd(node: unknown): node is NodeWithStartEnd {
	return (
		typeof node === "object" &&
		node !== null &&
		"start" in node &&
		typeof node.start === "number" &&
		"end" in node &&
		typeof node.end === "number"
	);
}

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
