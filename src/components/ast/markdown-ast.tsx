import markdown from "@eslint/markdown";
import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { MarkdownAstTreeItem } from "./markdown-ast-tree-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";

export const MarkdownAst: FC = () => {
	const { code, markdownOptions, viewModes } = useExplorer();
	const { astView } = viewModes;
	const { markdownMode } = markdownOptions;
	const language = markdown.languages[markdownMode];
	const result = language.parse({ body: code.markdown });

	if (!result.ok) {
		const message = parseError(result.errors[0]);
		return <ErrorState message={message} />;
	}

	const ast = JSON.stringify(result.ast, null, 2);

	if (astView === "tree") {
		return (
			<Accordion
				type="multiple"
				className="px-8 font-mono space-y-3"
				defaultValue={["0-root"]}
			>
				<MarkdownAstTreeItem data={result.ast} index={0} />
			</Accordion>
		);
	}

	return <Editor readOnly value={ast} />;
};
