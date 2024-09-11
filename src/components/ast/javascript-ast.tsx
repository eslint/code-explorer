import * as espree from "espree";
import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { JavascriptAstTreeItem } from "./javascript-ast-tree-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";

export const JavascriptAst: FC = () => {
	const explorer = useExplorer();
	const { viewModes } = explorer;
	const { astView } = viewModes;
	let ast = "";
	let tree: ReturnType<typeof espree.parse> | null = null;

	try {
		tree = espree.parse(explorer.code.javascript, {
			ecmaVersion: explorer.jsOptions.esVersion,
			sourceType: explorer.jsOptions.sourceType,
		});

		ast = JSON.stringify(tree, null, 2);
	} catch (error) {
		const message = parseError(error);
		return <ErrorState message={message} />;
	}
	if (astView === "tree") {
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

	return <Editor value={ast} readOnly />;
};
