import { Decoration, ViewPlugin } from "@codemirror/view";

const highlightRangeDecoration = Decoration.mark({
	class: "eslint-code-explorer_highlight-range",
});
export type HighlightRange = [rangeFrom: number, rangeTo: number];

export const highlightRangesExtension = (ranges: HighlightRange[]) =>
	ViewPlugin.define(() => ({}), {
		decorations: () =>
			Decoration.set(
				ranges.map(([rangeFrom, rangeTo]) =>
					highlightRangeDecoration.range(rangeFrom, rangeTo),
				),
			),
	});
