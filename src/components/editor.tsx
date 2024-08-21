"use client";

import { useEffect, useRef, useState, FC } from "react";
import { useExplorer } from "@/hooks/use-explorer";
import { useTheme } from "./theme-provider";
import CodeMirror from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import clsx from "clsx";

type EditorProperties = {
	readOnly?: boolean;
	value?: string;
	onChange?: (value: string) => void;
};

export const Editor: FC<EditorProperties> = ({ readOnly, value, onChange }) => {
	const { theme } = useTheme();
	const { wrap, jsonMode, language, isJSX } = useExplorer();
	const [isDragOver, setIsDragOver] = useState<boolean>(false);
	const editorContainerRef = useRef<HTMLDivElement | null>(null);
	const dropMessageRef = useRef<HTMLDivElement | null>(null);

	const editorExtensions = [
		basicSetup,
		...(language === "javascript"
			? [javascript({ jsx: isJSX })]
			: [json()]),
		wrap ? EditorView.lineWrapping : [],
		readOnly ? EditorState.readOnly.of(true) : [],
	];

	useEffect(() => {
		const editorContainer = editorContainerRef.current;

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

		const dropMessageDiv = dropMessageRef.current;
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
	}, [jsonMode, wrap, readOnly]);

	const editorClasses = clsx("h-full relative", {
		"bg-dropContainer": isDragOver,
		"bg-transparent": !isDragOver,
	});
	const dropMessageClasses = clsx(
		"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dropMessage text-white p-2 rounded-lg z-10",
		{
			flex: isDragOver,
			hidden: !isDragOver,
		},
	);

	return (
		<div ref={editorContainerRef} className={editorClasses}>
			<div ref={dropMessageRef} className={dropMessageClasses}>
				Drop here to read file
			</div>
			<CodeMirror
				value={value}
				extensions={editorExtensions}
				onChange={value => onChange?.(value)}
				theme={theme === "dark" ? "dark" : "light"}
				readOnly={readOnly}
			/>
		</div>
	);
};
