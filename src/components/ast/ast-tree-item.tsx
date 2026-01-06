import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";
import { mergeClassNames } from "@/lib/utils";

export type ASTNode = {
	readonly type: string;
	readonly [key: string]: unknown;
};

export type ASTTreeItemProperties = {
	readonly index: number;
	readonly data: ASTNode;
	readonly esqueryMatchedNodes: ASTNode[];
};

export const ASTTreeItem: FC<ASTTreeItemProperties> = ({
	data,
	index,
	esqueryMatchedNodes,
}) => {
	const isEsqueryMatchedNode = esqueryMatchedNodes.includes(data);

	return (
		<AccordionItem
			value={`${index}-${data.type}`}
			className={mergeClassNames(
				"border border-card rounded-lg overflow-hidden",
				isEsqueryMatchedNode && "border-primary border-4",
			)}
		>
			<AccordionTrigger className="text-sm bg-card px-4 py-3 capitalize">
				{data.type}
			</AccordionTrigger>
			<AccordionContent className="p-4 border-t">
				<ul className="space-y-1">
					{Object.entries(data).map(item => (
						<TreeEntry
							key={item[0]}
							data={item}
							esqueryMatchedNodes={esqueryMatchedNodes}
						/>
					))}
				</ul>
			</AccordionContent>
		</AccordionItem>
	);
};
