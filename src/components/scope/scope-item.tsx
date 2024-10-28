import { Scope, Variable, Reference } from "eslint-scope";
import { TreeEntry } from "../tree-entry";
import type { FC } from "react";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

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

	// filter out hidden properties
	const properties = Object.entries(data).filter(
		([name]) => !name.startsWith("__"),
	);

	if (path.length === 1) {
		return (
			<AccordionItem
				value={path + "." + index + "." + key}
				className="border border-card rounded-lg overflow-hidden"
			>
				<AccordionTrigger className="text-sm bg-card px-4 py-3 capitalize">
					{isArray && `${Math.max(index, 0)}.`} {key}
				</AccordionTrigger>
				<AccordionContent className="p-4 border-t">
					<div className="space-y-1">
						{properties.map((item, index) => (
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
	}

	return (
		<div className="border border-card rounded-lg overflow-hidden">
			<button className="flex items-center font-medium text-sm bg-card px-4 py-3 capitalize w-full">
				{isArray && `${Math.max(index, 0)}.`} {key}
			</button>
			<div className="overflow-hidden text-sm">
				<div className="p-4 border-t">
					<div className="space-y-1">
						{properties.map((item, index) => (
							<TreeEntry
								key={item[0]}
								data={item}
								path={path + "." + index}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
