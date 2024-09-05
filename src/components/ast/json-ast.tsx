import json from "@eslint/json";
import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { JsonAstTreeItem } from "./json-ast-tree-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";

export const JsonAst: FC = () => {
	const explorer = useExplorer();
	const language = json.languages[explorer.jsonMode];
	const result = language.parse({ body: explorer.jsonCode });

	if (!result.ok) {
		const message = parseError(result.errors[0]);
		return <ErrorState message={message} />;
	}

	const ast = JSON.stringify(result.ast, null, 2);

	if (explorer.astViewMode === "tree") {
		return (
			<Accordion
				type="multiple"
				className="px-8 font-mono space-y-3"
				defaultValue={["0-Document"]}
			>
				<JsonAstTreeItem data={result.ast} index={0} />
			</Accordion>
		);
	}

	return <Editor readOnly value={ast} />;
};
