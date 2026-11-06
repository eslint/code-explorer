import { Decoration, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import type { SourceRange } from "@eslint/core";

const highlightRangeDecoration = Decoration.mark({
	class: "bg-editorHighlightedRangeColor",
});

function createHighlightedRangeDecorations(ranges: SourceRange[]) {
	return Decoration.set(
		ranges
			.filter(([rangeFrom, rangeTo]) => rangeFrom < rangeTo)
			.map(([rangeFrom, rangeTo]) =>
				highlightRangeDecoration.range(rangeFrom, rangeTo),
			),
		true,
	);
}

export const highlightedRangesExtension = (
	ranges: SourceRange[],
	code: string,
) =>
	ViewPlugin.define(
		view => ({
			decorations:
				view.state.doc.toString() === code
					? createHighlightedRangeDecorations(ranges)
					: null,

			update(update: ViewUpdate) {
				if (!update.docChanged) {
					return;
				}

				if (this.decorations) {
					this.decorations = this.decorations.map(update.changes);
				} else if (update.state.doc.toString() === code) {
					this.decorations =
						createHighlightedRangeDecorations(ranges);
				}
			},
		}),
		{
			decorations: value => value.decorations ?? Decoration.none,
		},
	);
