import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";
import type * as espree from "espree";

type JavascriptAstTreeItemProperties = {
	readonly index: number;
	readonly data:
		| ReturnType<typeof espree.parse>
		| ReturnType<typeof espree.parse>["body"][number];
};

export const JavascriptAstTreeItem: FC<JavascriptAstTreeItemProperties> = ({
	data,
	index,
}) => (
	<AccordionItem
		value={`${index}-${data.type}`}
		className="border rounded-lg overflow-hidden min-w-80"
	>
		<AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3 capitalize">
			{data.type}
		</AccordionTrigger>
		<AccordionContent className="p-4 overflow-x-scroll mr-2">
			<div className="space-y-1">
				{Object.entries(data).map(item => (
					<TreeEntry key={item[0]} data={item} />
				))}
			</div>
		</AccordionContent>
	</AccordionItem>
);
