import type { FC } from "react";
import { useAST } from "@/hooks/use-ast";
import { useExplorer } from "@/hooks/use-explorer";
import { Accordion } from "@/components/ui/accordion";
import { Editor } from "@/components/editor";
import { ErrorState } from "@/components/error-boundary";
import { ASTTreeItem } from "@/components/ast/ast-tree-item";
import type { ASTNode } from "@/components/ast/ast-tree-item";
import { parseError } from "@/lib/parse-error";

export const AST: FC = () => {
	const result = useAST();
	const { viewModes, language } = useExplorer();
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
				key={`${language}`}
				defaultValue={[`0-${(result.ast as ASTNode).type}`]}
			>
				<ASTTreeItem
					data={result.ast as ASTNode}
					index={0}
					esqueryMatchedNodes={
						result.esqueryMatchedNodes as ASTNode[]
					}
				/>
			</Accordion>
		);
	}

	return <Editor readOnly value={ast} />;
};
