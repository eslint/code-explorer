import { Decoration, ViewPlugin } from "@codemirror/view";
import type { SourceRange } from "@eslint/core";

const highlightRangeDecoration = Decoration.mark({
	class: "bg-editorHighlightedRangeColor",
});

export const highlightedRangesExtension = (ranges: SourceRange[]) =>
	ViewPlugin.define(() => ({}), {
		decorations: () =>
			Decoration.set(
				ranges.map(([rangeFrom, rangeTo]) =>
					highlightRangeDecoration.range(rangeFrom, rangeTo),
				),
				true,
			),
	});
