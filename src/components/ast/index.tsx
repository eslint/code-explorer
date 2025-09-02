import { useExplorer } from "@/hooks/use-explorer";
import { JavascriptAst } from "./javascript-ast";
import { JsonAst } from "./json-ast";
import { CssAst } from "./css-ast";
import { MarkdownAst } from "./markdown-ast";
import { HtmlAst } from "./html-ast";
import type { FC } from "react";

export const Ast: FC = () => {
	const { language } = useExplorer();

	switch (language) {
		case "markdown":
			return <MarkdownAst />;
		case "json":
			return <JsonAst />;
		case "css":
			return <CssAst />;
		case "html":
			return <HtmlAst />;
		default:
			return <JavascriptAst />;
	}
};
