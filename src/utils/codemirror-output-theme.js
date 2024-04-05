import { EditorView } from "@codemirror/view";

export const ExplorerOutputTheme = EditorView.theme({
    ".cm-tooltip": {
        backgroundColor: "transparent",
        border: "none"
    },
    ".cm-scroller": {
        backgroundColor: "var(--lightest-background-color)",
        minWidth: "100%",

        // This is not necessary if you want to match the figma design.
        // border: "1px solid var(--body-text-color)",
        fontVariantLigatures: "none",
        fontFamily: "var(--mono-font), Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
        fontSize: "1em",
        color: "var(--body-text-color)"
    },
    ".cm-gutter": {
        paddingRight: "1px",
        backgroundColor: "var(--lightest-background-color)"
    },
    ".cm-activeLine, .cm-activeLineGutter": {
        backgroundColor: "var(--lightest-background-color)"
    },
    ".cm-content": {
        caretColor: "var(--link-color)"
    },
    "&.cm-focused .cm-matchingBracket": {
        backgroundColor: "var(--editor-bracket-match-background-color)",
        color: "var(--editor-bracket-match-color)",
        outline: "1px solid var(--editor-bracket-match-outline-color)"
    },
    "&.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: "var(--editor-bracket-no-match-background-color)",
        color: "var(--editor-bracket-no-match-color)",
        outline: "1px solid var(--editor-bracket-no-match-outline-color)"
    },
    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--link-color)"
    },
    ".cm-gutters": {

        // This is not necessary if you want to match the figma design.
        // borderRight: "1px solid var(--body-text-color)"
    },
    ".cm-gutterElement": {
        color: "var(--body-text-color)"
    },
    ".cm-tooltip-autocomplete": {
        backgroundColor: "var(--color-neutral-800)",
        color: "#fff"
    },
    ".cm-completionIcon": {
        width: "1.2rem"
    },
    ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
        margin: "0"
    }
}, { dark: true });
