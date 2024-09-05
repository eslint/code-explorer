"use client";

import { useExplorer } from "@/hooks/use-explorer";
import { JavascriptAst } from "./javascript-ast";
import { JsonAst } from "./json-ast";
import { MarkdownAst } from "./markdown-ast";
import type { FC } from "react";

export const Ast: FC = () => {
	const explorer = useExplorer();
	const { language } = explorer;

	switch (language) {
		case "markdown":
			return <MarkdownAst />;
		case "json":
			return <JsonAst />;
		default:
			return <JavascriptAst />;
	}
};
