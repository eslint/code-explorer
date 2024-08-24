import { parse } from "@humanwhocodes/momoa";
import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { JsonAstTreeItem } from "./json-ast-tree-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";

export const JsonAst: FC = () => {
	const explorer = useExplorer();
	let ast = "";
	let tree: ReturnType<typeof parse> | null = null;

	try {
		tree = parse(explorer.jsonCode, {
			mode: explorer.jsonMode,
			ranges: true,
			tokens: true,
		});

		ast = JSON.stringify(tree, null, 2);
	} catch (error) {
		const message = parseError(error);
		return <ErrorState message={message} />;
	}

	if (explorer.astViewMode === "tree") {
		if (tree === null) {
			return null;
		}

		return (
			<Accordion
				type="multiple"
				className="px-8 font-mono space-y-3"
				defaultValue={["0-Document"]}
			>
				<JsonAstTreeItem data={tree} index={0} />
			</Accordion>
		);
	}

	return <Editor defaultLanguage="json" value={ast} />;
};
