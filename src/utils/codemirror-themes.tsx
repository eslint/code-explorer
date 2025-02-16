import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";

export const ESLintPlaygroundTheme = EditorView.theme(
	{
		".cm-tooltip": {
			backgroundColor: "transparent",
			border: "none",
		},
		".cm-scroller": {
			backgroundColor: "hsl(var(--background))",
			fontVariantLigatures: "none",
			color: "var(--body-text-color)",
		},
		".cm-gutter": {
			paddingRight: "1px",
			backgroundColor: "var(--body-background-color)",
		},
		".cm-activeLine": {
			backgroundColor: "transparent",
		},
		".cm-activeLineGutter": {
			backgroundColor: "var(--body-background-color)",
		},
		".cm-content": {
			caretColor: "var(--link-color)",
		},
		"&.cm-focused .cm-matchingBracket": {
			backgroundColor: "var(--editor-bracket-match-background-color)",
			color: "var(--editor-bracket-match-color)",
			outline: "1px solid var(--editor-bracket-match-outline-color)",
		},
		"&.cm-focused .cm-nonmatchingBracket": {
			backgroundColor: "var(--editor-bracket-no-match-background-color)",
			color: "var(--editor-bracket-no-match-color)",
			outline: "1px solid var(--editor-bracket-no-match-outline-color)",
		},
		".cm-cursor, .cm-dropCursor": {
			borderLeftColor: "var(--link-color)",
		},
		".cm-gutters": {
			borderRight: "1px solid hsl(var(--border))",
		},
		".cm-gutterElement": {
			color: "var(--body-text-color)",
		},
		".cm-tooltip-autocomplete": {
			backgroundColor: "var(--color-neutral-800)",
			color: "#fff",
		},
		".cm-completionIcon": {
			width: "1.2rem",
		},
		".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
			margin: "0",
		},
		"&.cm-editor .cm-content .cm-line ::selection": {
			color: "#fff !important",
		},
	},
	{ dark: true },
);

const HighlightDefinition = HighlightStyle.define([
	{
		tag: tags.string,
		color: "var(--editor-string-color)",
	},
	{
		tag: tags.keyword,
		color: "var(--editor-keyword-color)",
		fontWeight: "bold",
	},
	{
		tag: [tags.lineComment, tags.blockComment],
		color: "var(--editor-comment-color)",
	},
	{
		tag: [
			tags.name,
			tags.deleted,
			tags.character,
			tags.propertyName,
			tags.macroName,
		],
		color: "var(--editor-name-color) !important",
	},
	{
		tag: tags.strong,
		fontWeight: "bold",
	},
	{
		tag: tags.emphasis,
		fontStyle: "italic",
	},
	{
		tag: tags.strikethrough,
		textDecoration: "line-through",
	},
	{
		tag: tags.heading,
		fontWeight: "bold",
		color: "var(--headings-color) !important",
	},
]);

export const ESLintPlaygroundHighlightStyle =
	syntaxHighlighting(HighlightDefinition);
