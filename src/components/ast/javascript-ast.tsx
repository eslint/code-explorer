import * as espree from "espree";
import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { JavascriptAstTreeItem } from "./javascript-ast-tree-item";
import type { FC } from "react";

export const JavascriptAst: FC = () => {
	const explorer = useExplorer();
	const tree = espree.parse(explorer.jsCode, {
		ecmaVersion: explorer.esVersion,
		sourceType: explorer.sourceType,
	});
	const ast = JSON.stringify(tree, null, 2);

	if (explorer.astViewMode === "tree") {
		if (tree === null) {
			return null;
		}

		return (
			<Accordion
				type="multiple"
				className="px-8 font-mono space-y-3"
				defaultValue={["0-Program"]}
			>
				<JavascriptAstTreeItem data={tree} index={0} />
			</Accordion>
		);
	}

	return <Editor defaultLanguage="json" value={ast} readOnly={true} />;
};
