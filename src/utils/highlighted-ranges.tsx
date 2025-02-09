import { Decoration, ViewPlugin } from "@codemirror/view";

const highlightRangeDecoration = Decoration.mark({
	class: "eslint-code-explorer_highlighted-range",
});
export type HighlightedRange = [rangeFrom: number, rangeTo: number];

export const highlightedRangesExtension = (ranges: HighlightedRange[]) =>
	ViewPlugin.define(() => ({}), {
		decorations: () =>
			Decoration.set(
				ranges.map(([rangeFrom, rangeTo]) =>
					highlightRangeDecoration.range(rangeFrom, rangeTo),
				),
			),
	});
