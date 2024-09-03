import { Scope, Variable, Reference } from "eslint-scope";
import { capitalize } from "@/lib/utils";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";

type ScopeItemProperties = {
	readonly index: number;
	readonly data: Scope | Variable | Reference | null;
};

export const ScopeItem: FC<ScopeItemProperties> = ({ data, index }) => {
	if (!data) {
		return null;
	}

	let key = "unknown";

	console.log(data);

	if (data instanceof Scope) {
		key = data.type;
	} else if (data instanceof Variable) {
		key = data.name;
	} else if (data instanceof Reference) {
		key = data.identifier.name;
	}

	return (
		<AccordionItem
			value={`${index}-${key}`}
			className="border rounded-lg overflow-hidden"
		>
			<AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3">
				{Math.max(index, 0)}. {capitalize(key)}
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
};
