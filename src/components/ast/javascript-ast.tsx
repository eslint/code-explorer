import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { useAST } from "@/hooks/use-ast";
import {
	JavascriptAstTreeItem,
	type JavascriptAstTreeItemProperties,
} from "./javascript-ast-tree-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";

export const JavascriptAst: FC = () => {
	const result = useAST();
	const explorer = useExplorer();
	const { viewModes } = explorer;
	const { astView } = viewModes;

	if (!result.ok) {
		const message = parseError(result.errors[0]);
		return <ErrorState message={message} />;
	}

	const ast = JSON.stringify(result.ast, null, 2);

	if (astView === "tree") {
		if (result.ast === null) {
			return null;
		}

		return (
			<Accordion
				type="multiple"
				className="px-8 pb-4 font-mono space-y-3 min-w-max"
				defaultValue={["0-Program"]}
			>
				<JavascriptAstTreeItem
					data={result.ast as JavascriptAstTreeItemProperties["data"]}
					index={0}
					esqueryMatchedNodes={
						result.esqueryMatchedNodes as JavascriptAstTreeItemProperties["esqueryMatchedNodes"]
					}
				/>
			</Accordion>
		);
	}

	return <Editor value={ast} readOnly />;
};
