import { Scope, Variable, Reference } from "eslint-scope";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";
import { cn } from "@/lib/utils";

type ScopeItemProperties = {
	isArray: boolean;
	readonly index: number;
	readonly path: string;
	readonly data: Scope | Variable | Reference | null;
	readonly esqueryMatchedNodes: unknown[];
};

export const ScopeItem: FC<ScopeItemProperties> = ({
	data,
	index,
	path,
	isArray,
	esqueryMatchedNodes,
}) => {
	if (!data) {
		return null;
	}

	let key;

	if (data instanceof Scope) {
		key = data.type;
	} else if (data instanceof Variable) {
		key = data.name;
	} else if (data instanceof Reference) {
		key = data.identifier.name;
	} else {
		key = (data as Record<string, string>)?.type ?? typeof data;
	}

	const isEsqueryMatchedNode = esqueryMatchedNodes.includes(data);

	// filter out hidden properties
	const properties = Object.entries(data).filter(
		([name]) => !name.startsWith("__"),
	);

	return (
		<AccordionItem
			value={path + "." + index + "." + key}
			className={cn(
				"border border-card rounded-lg overflow-hidden",
				isEsqueryMatchedNode && "border-primary border-4",
			)}
		>
			<AccordionTrigger className="text-sm bg-card px-4 py-3 capitalize">
				{isArray && `${Math.max(index, 0)}.`} {key}
			</AccordionTrigger>
			<AccordionContent className="p-4 border-t">
				<ul className="space-y-1">
					{properties.map((item, index) => (
						<TreeEntry
							key={item[0]}
							data={item}
							path={path + "." + index}
							esqueryMatchedNodes={esqueryMatchedNodes}
						/>
					))}
				</ul>
			</AccordionContent>
		</AccordionItem>
	);
};
