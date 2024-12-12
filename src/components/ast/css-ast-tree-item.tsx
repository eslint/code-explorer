import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";

type ASTNode = {
	readonly type: string;
	readonly [key: string]: unknown;
};

type CssAstTreeItemProperties = {
	readonly index: number;
	readonly data: ASTNode;
};

export const CssAstTreeItem: FC<CssAstTreeItemProperties> = ({
	data,
	index,
}) => (
	<AccordionItem
		value={`${index}-${data.type}`}
		className="border border-card rounded-lg overflow-hidden"
	>
		<AccordionTrigger className="text-sm bg-card px-4 py-3 capitalize">
			{data.type}
		</AccordionTrigger>
		<AccordionContent className="p-4 border-t">
			<div className="space-y-1">
				{Object.entries(data).map(item => (
					<TreeEntry key={item[0]} data={item} />
				))}
			</div>
		</AccordionContent>
	</AccordionItem>
);
