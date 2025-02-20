import { Decoration, ViewPlugin } from "@codemirror/view";

const highlightRangeDecoration = Decoration.mark({
	class: "bg-editorHighlightedRangeColor",
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
