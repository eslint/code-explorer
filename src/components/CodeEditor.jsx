/**
 * @fileoverview A JavaScript code editor component.
 * 
 * It was mostly inspired by the CodeEditor in the ESLint playground,
 * but it doesn't have the linter marker features.
 * @see https://github.com/eslint/eslint.org/blob/e6f10f42b5aa203096412686076e91190b93cf9f/src/playground/components/CodeEditor.js
 */
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { history } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { javascript } from "@codemirror/lang-javascript";
import { ESLintPlaygroundTheme, ESLintPlaygroundHighlightStyle } from "../utils/codemirror-theme.js";
import "../scss/editor.scss";

const extensions = [
    history(),
    bracketMatching(),
    javascript(),
    ESLintPlaygroundTheme,
    ESLintPlaygroundHighlightStyle
];

export default function CodeEditor({ codeValue, onUpdate }) {

    return (
        <CodeMirror
            value={codeValue}
            minWidth="100%"
            height="100%"
            extensions={
                extensions
            }
            onChange={value => {
                onUpdate(value);
            }}
        />
    );
}
