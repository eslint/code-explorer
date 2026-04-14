import { Decoration, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import type { SourceRange } from "@eslint/core";

const highlightRangeDecoration = Decoration.mark({
	class: "bg-editorHighlightedRangeColor",
});

function createHighlightedRangeDecorations(ranges: SourceRange[]) {
	return Decoration.set(
		ranges.map(([rangeFrom, rangeTo]) =>
			highlightRangeDecoration.range(rangeFrom, rangeTo),
		),
		true,
	);
}

export const highlightedRangesExtension = (ranges: SourceRange[]) =>
	ViewPlugin.define(
		() => ({
			decorations: createHighlightedRangeDecorations(ranges),

			update(update: ViewUpdate) {
				if (update.docChanged) {
					this.decorations = this.decorations.map(update.changes);
				}
			},
		}),
		{
			decorations: value => value.decorations,
		},
	);
