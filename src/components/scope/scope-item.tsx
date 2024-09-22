import { Scope, Variable, Reference } from "eslint-scope";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";

type ScopeItemProperties = {
	isArray: boolean;
	readonly index: number;
	readonly path: string;
	readonly data: Scope | Variable | Reference | null;
};

export const ScopeItem: FC<ScopeItemProperties> = ({
	data,
	index,
	path,
	isArray,
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

	return (
		<AccordionItem
			value={path + "." + index + "." + key}
			className="border rounded-lg overflow-hidden"
		>
			<AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3 capitalize">
				{isArray && `${Math.max(index, 0)}.`} {key}
			</AccordionTrigger>
			<AccordionContent className="p-4 border-t">
				<div className="space-y-1">
					{Object.entries(data).map((item, index) => (
						<TreeEntry
							key={item[0]}
							data={item}
							path={path + "." + index}
						/>
					))}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};
