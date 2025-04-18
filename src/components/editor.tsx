"use client";

import { useEffect, useRef, useState, FC, useMemo } from "react";
import { useExplorer } from "@/hooks/use-explorer";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import clsx from "clsx";
import { LanguageSupport } from "@codemirror/language";
import { debounce } from "../lib/utils";
import {
	ESLintPlaygroundTheme,
	ESLintPlaygroundHighlightStyle,
} from "@/utils/codemirror-themes";
import {
	highlightedRangesExtension,
	type HighlightedRange,
} from "@/utils/highlighted-ranges";

const languageExtensions: Record<string, (isJSX?: boolean) => LanguageSupport> =
	{
		javascript: (isJSX: boolean = false) => javascript({ jsx: isJSX }),
		json: () => json(),
		markdown: () => markdown(),
		css: () => css(),
	};

type EditorProperties = {
	readOnly?: boolean;
	value?: string;
	highlightedRanges?: HighlightedRange[];
	onChange?: (value: string) => void;
};

export const Editor: FC<EditorProperties> = ({
	readOnly,
	value,
	highlightedRanges = [],
	onChange,
}) => {
	const { wrap, language, jsOptions } = useExplorer();
	const { isJSX } = jsOptions;
	const [isDragOver, setIsDragOver] = useState<boolean>(false);
	const editorContainerRef = useRef<HTMLDivElement | null>(null);
	const dropMessageRef = useRef<HTMLDivElement | null>(null);

	const activeLanguageExtension = readOnly
		? languageExtensions.json()
		: languageExtensions[language]
			? languageExtensions[language](isJSX)
			: [];

	const editorExtensions = [
		activeLanguageExtension,
		wrap ? EditorView.lineWrapping : [],
		readOnly ? EditorState.readOnly.of(true) : [],
		ESLintPlaygroundTheme,
		ESLintPlaygroundHighlightStyle,
		highlightedRangesExtension(highlightedRanges),
	];

	const debouncedOnChange = useMemo(
		() =>
			debounce((value: string) => {
				onChange?.(value);
			}, 400),
		[onChange],
	);

	useEffect(() => {
		if (readOnly) return;

		const editorContainer = editorContainerRef.current;
		const dropMessageDiv = dropMessageRef.current;

		const handleDragOver = (event: DragEvent) => {
			event.preventDefault();
			setIsDragOver(true);
		};

		const handleDragLeave = () => {
			setIsDragOver(false);
		};

		const handleDrop = async (event: DragEvent) => {
			event.preventDefault();
			setIsDragOver(false);

			const files = event.dataTransfer?.files;
			if (files?.length) {
				const file = files[0];
				const text = await file.text();
				if (editorContainer) {
					const editor: HTMLDivElement | null =
						editorContainer.querySelector(".cm-content");
					if (editor) {
						editor.innerText = text;
					}
				}
			}
		};

		editorContainer?.addEventListener("dragover", handleDragOver);
		editorContainer?.addEventListener("dragleave", handleDragLeave);
		editorContainer?.addEventListener("drop", handleDrop);

		if (dropMessageDiv) {
			dropMessageDiv.addEventListener("dragover", handleDragOver);
			dropMessageDiv.addEventListener("dragleave", handleDragLeave);
			dropMessageDiv.addEventListener("drop", handleDrop);
		}

		return () => {
			editorContainer?.removeEventListener("dragover", handleDragOver);
			editorContainer?.removeEventListener("dragleave", handleDragLeave);
			editorContainer?.removeEventListener("drop", handleDrop);

			if (dropMessageDiv) {
				dropMessageDiv.removeEventListener("dragover", handleDragOver);
				dropMessageDiv.removeEventListener(
					"dragleave",
					handleDragLeave,
				);
				dropMessageDiv.removeEventListener("drop", handleDrop);
			}
		};
	}, [readOnly]);

	const editorClasses = clsx("relative", {
		"h-[calc(100vh-152px)]": readOnly,
		"h-[calc(100vh-72px)]": !readOnly,
	});

	const dropMessageClasses = clsx(
		"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dropMessage text-white p-2 rounded-lg z-10",
		{
			flex: isDragOver,
			hidden: !isDragOver,
		},
	);

	const dropAreaClass = clsx(
		"absolute top-1/2 h-full w-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-2 z-10",
		{
			"bg-dropContainer": isDragOver,
			"bg-transparent": !isDragOver,
			flex: isDragOver,
			hidden: !isDragOver,
		},
	);

	return (
		<div ref={editorContainerRef} className={editorClasses}>
			{!readOnly && (
				<div ref={dropMessageRef} className={dropAreaClass}>
					<div className={dropMessageClasses}>
						Drop here to read file
					</div>
				</div>
			)}
			<CodeMirror
				aria-label="Code Editor"
				className="h-full overflow-auto scrollbar-thumb scrollbar-track text-sm"
				value={value}
				extensions={editorExtensions}
				onChange={value => debouncedOnChange(value)}
				readOnly={readOnly}
			/>
		</div>
	);
};
