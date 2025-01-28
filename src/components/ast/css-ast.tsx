import css from "@eslint/css";
import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { CssAstTreeItem } from "./css-ast-tree-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";

export const CssAst: FC = () => {
	const { code, cssOptions, viewModes } = useExplorer();
	const { astView } = viewModes;
	const { cssMode, tolerant } = cssOptions;
	const language = css.languages[cssMode];
	const result = language.parse(
		{ body: code.css },
		{
			languageOptions: { tolerant },
		},
	);

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
				defaultValue={["0-StyleSheet"]}
			>
				<CssAstTreeItem data={result.ast} index={0} />
			</Accordion>
		);
	}

	return <Editor readOnly value={ast} />;
};
