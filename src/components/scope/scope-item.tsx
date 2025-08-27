import { Scope, Variable, Reference } from "eslint-scope";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";
import { mergeClassNames } from "@/lib/utils";

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

	if (isArray) {
		return (
			<AccordionItem
				value={path + "." + index + "." + key}
				className={mergeClassNames(
					"border border-card rounded-lg overflow-hidden",
					isEsqueryMatchedNode && "border-primary border-4",
				)}
			>
				<AccordionTrigger className="text-sm bg-card px-4 py-3 capitalize">
					{`${Math.max(index, 0)}. ${key}`}
				</AccordionTrigger>
				<AccordionContent className="p-4 border-t">
					<div className="space-y-1">
						{properties.map((item, index) => (
							<TreeEntry
								key={item[0]}
								data={item}
								path={path + "." + index}
								esqueryMatchedNodes={esqueryMatchedNodes}
							/>
						))}
					</div>
				</AccordionContent>
			</AccordionItem>
		);
	}

	return (
		<div
			className={mergeClassNames(
				"border border-card rounded-lg overflow-hidden",
				isEsqueryMatchedNode && "border-primary border-4",
			)}
		>
			<h3 className="text-sm bg-card px-4 py-3 capitalize">{key}</h3>
			<div className="p-4 border-t">
				<div className="space-y-1">
					{properties.map((item, index) => (
						<TreeEntry
							key={item[0]}
							data={item}
							path={path + "." + index}
							esqueryMatchedNodes={esqueryMatchedNodes}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
