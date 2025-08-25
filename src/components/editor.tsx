"use client";

import { useEffect, useRef, useState, FC, useMemo } from "react";
import { useExplorer, type Language } from "@/hooks/use-explorer";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import { LanguageSupport } from "@codemirror/language";
import { cn, debounce } from "@/lib/utils";
import {
	ESLintPlaygroundTheme,
	ESLintPlaygroundHighlightStyle,
} from "@/utils/codemirror-themes";
import {
	highlightedRangesExtension,
	type HighlightedRange,
} from "@/utils/highlighted-ranges";

const languageExtensions: Record<
	Language,
	(isJSX?: boolean) => LanguageSupport
> = {
	javascript: (isJSX: boolean = false) => javascript({ jsx: isJSX }),
	json: () => json(),
	markdown: () => markdown(),
	css: () => css(),
	html: () => html(),
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
	const dragDepthRef = useRef(0);

	const activeLanguageExtension = useMemo<LanguageSupport>(() => {
		if (readOnly) return languageExtensions.json();
		return languageExtensions[language](isJSX);
	}, [readOnly, language, isJSX]);

	const editorExtensions = useMemo(
		() => [
			activeLanguageExtension,
			wrap ? EditorView.lineWrapping : [],
			ESLintPlaygroundTheme,
			ESLintPlaygroundHighlightStyle,
			highlightedRangesExtension(highlightedRanges),
		],
		[activeLanguageExtension, wrap, highlightedRanges],
	);

	const debouncedOnChange = useMemo(
		() =>
			debounce((value: string) => {
				onChange?.(value);
			}, 400),
		[onChange],
	);

	useEffect(() => {
		return () => {
			debouncedOnChange.cancel();
		};
	}, [debouncedOnChange]);

	useEffect(() => {
		if (readOnly) return;

		const editorContainer = editorContainerRef.current;

		const isFileDrag = (event: DragEvent) =>
			event.dataTransfer?.types.includes("Files");

		const handleDragEnter = (event: DragEvent) => {
			if (!isFileDrag(event)) return;
			dragDepthRef.current += 1;
			setIsDragOver(true);
		};

		const handleDragOver = (event: DragEvent) => {
			event.preventDefault();
			if (!isFileDrag(event)) return;
			setIsDragOver(true);
		};

		const handleDragLeave = () => {
			if (dragDepthRef.current > 0) {
				dragDepthRef.current -= 1;
			}
			if (dragDepthRef.current <= 0) {
				dragDepthRef.current = 0;
				setIsDragOver(false);
			}
		};

		const handleDrop = async (event: DragEvent) => {
			event.preventDefault();
			dragDepthRef.current = 0;
			setIsDragOver(false);

			const files = event.dataTransfer?.files;
			if (files?.length) {
				const file = files[0];
				const text = await file.text();
				onChange?.(text);
			}
		};

		const handleDragEnd = () => {
			dragDepthRef.current = 0;
			setIsDragOver(false);
		};

		editorContainer?.addEventListener("dragenter", handleDragEnter);
		editorContainer?.addEventListener("dragover", handleDragOver);
		editorContainer?.addEventListener("dragleave", handleDragLeave);
		editorContainer?.addEventListener("drop", handleDrop);
		window.addEventListener("dragend", handleDragEnd);

		// Prevent navigation when dropping files outside the editor
		const preventWindowNav = (event: DragEvent) => {
			event.preventDefault();
		};
		window.addEventListener("dragover", preventWindowNav);
		window.addEventListener("drop", preventWindowNav);

		return () => {
			editorContainer?.removeEventListener("dragenter", handleDragEnter);
			editorContainer?.removeEventListener("dragover", handleDragOver);
			editorContainer?.removeEventListener("dragleave", handleDragLeave);
			editorContainer?.removeEventListener("drop", handleDrop);
			window.removeEventListener("dragend", handleDragEnd);
			window.removeEventListener("dragover", preventWindowNav);
			window.removeEventListener("drop", preventWindowNav);
		};
	}, [onChange, readOnly]);

	const editorClasses = cn("relative", {
		"h-[calc(100%-72px)]": readOnly,
		"h-[calc(100%-57px)]": !readOnly,
	});

	const dropAreaClass = cn(
		"absolute inset-0 z-10 pointer-events-none flex items-center justify-center transition-opacity duration-150 bg-dropContainer",
		{
			"opacity-0": !isDragOver,
		},
	);

	return (
		<div ref={editorContainerRef} className={editorClasses}>
			{!readOnly && (
				<div className={dropAreaClass}>
					<div
						className="bg-dropMessage text-white p-2 rounded-lg"
						role="status"
					>
						Drop here to read file
					</div>
				</div>
			)}
			<CodeMirror
				className="h-full overflow-auto scrollbar-thumb scrollbar-track text-sm"
				value={value}
				extensions={editorExtensions}
				onChange={debouncedOnChange}
				readOnly={readOnly}
			/>
		</div>
	);
};
