import { MinusSquareIcon, PlusSquareIcon } from "lucide-react";
import { useState } from "react";
import { renderValue } from "@/lib/render-value";
import { ScopeItem } from "./scope/scope-item";
import { Reference, Variable, Scope } from "eslint-scope";
import type { FC, ReactNode } from "react";

type TreeEntryProperties = {
	readonly data: [string, unknown];
	readonly path?: string;
	readonly esqueryMatchedNodes: unknown[];
};

const isProbablyNode = (value: unknown) => {
	return (
		value &&
		typeof value === "object" &&
		"type" in value &&
		"range" in value &&
		typeof value.type === "string" &&
		Array.isArray(value.range)
	);
};

const SanitizeValue = ({
	value,
	path,
	isArray,
	index,
	esqueryMatchedNodes,
}: {
	value: unknown;
	isArray: boolean;
	path?: string;
	index: number;
	esqueryMatchedNodes: unknown[];
}): ReactNode => {
	if (!value) {
		return null;
	}

	if (Array.isArray(value)) {
		if (typeof value[0] === "object") {
			return value.map((item, index) => (
				<SanitizeValue
					key={index}
					path={path + "." + index}
					value={item}
					index={index}
					isArray={Array.isArray(value)}
					esqueryMatchedNodes={esqueryMatchedNodes}
				/>
			));
		}

		return (
			<pre className="ml-8 max-h-44 bg-card border overflow-auto rounded-lg p-3">
				{JSON.stringify(value, null, 2)}
			</pre>
		);
	}

	if (
		value instanceof Scope ||
		value instanceof Reference ||
		value instanceof Variable ||
		// Node
		isProbablyNode(value)
	) {
		return (
			<div className="mt-3 space-y-3 ml-6">
				<ScopeItem
					path={path + "." + index}
					isArray={isArray}
					data={value as Scope}
					index={index}
					esqueryMatchedNodes={esqueryMatchedNodes}
				/>
			</div>
		);
	}

	return (
		<div className="ml-8">
			<ScopeItem
				path={path + "." + index}
				isArray={isArray}
				data={value as Scope}
				index={index}
				esqueryMatchedNodes={esqueryMatchedNodes}
			/>
		</div>
	);
};

export const TreeEntry: FC<TreeEntryProperties> = ({
	data,
	path,
	esqueryMatchedNodes,
}) => {
	const [key, value] = data;
	const [open, setOpen] = useState(false);
	const Icon = open ? MinusSquareIcon : PlusSquareIcon;

	const toggleOpen = () => setOpen(!open);

	return (
		<>
			<li className="flex items-center gap-3">
				{(typeof value === "object" &&
					Object.values(value ?? {}).length) ||
				(Array.isArray(value) && value.length) ? (
					<button
						onClick={toggleOpen}
						aria-label="Toggle Property"
						type="button"
					>
						<Icon size={16} className="text-muted-foreground" />
					</button>
				) : (
					<div className="w-4 h-4" />
				)}
				{key && <span>{key}</span>}
				{renderValue(value).map((part, partIndex) => (
					<span
						key={partIndex}
						className={
							partIndex ? "text-muted-foreground" : "text-primary"
						}
					>
						{part}
					</span>
				))}
			</li>
			{open ? (
				<SanitizeValue
					path={path}
					value={value}
					isArray={Array.isArray(value)}
					index={0}
					esqueryMatchedNodes={esqueryMatchedNodes}
				/>
			) : null}
		</>
	);
};
