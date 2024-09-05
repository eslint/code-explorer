"use client";

import * as espree from "espree";
import * as eslintScope from "eslint-scope";
import { useExplorer } from "@/hooks/use-explorer";
import { Accordion } from "@/components/ui/accordion";
import { ScopeItem } from "./scope-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";

export const Scope: FC = () => {
	const explorer = useExplorer();
	let ast = {};
	let scopeManager = null;

	try {
		ast = espree.parse(explorer.code.javascript, {
			range: true,
			ecmaVersion: explorer.jsOptions.esVersion,
			sourceType: explorer.jsOptions.sourceType,
			ecmaFeatures: {
				jsx: explorer.jsOptions.isJSX,
			},
		});
		scopeManager = eslintScope.analyze(ast, {
			sourceType: explorer.jsOptions.sourceType as never,
			ecmaVersion:
				explorer.jsOptions.esVersion === "latest"
					? espree.latestEcmaVersion
					: explorer.jsOptions.esVersion,
		});
	} catch (error) {
		const message = parseError(error);
		return <ErrorState message={message} />;
	}

	return (
		<Accordion
			type="multiple"
			className="px-8 font-mono space-y-3"
			defaultValue={["0-global"]}
		>
			{explorer.scopeViewMode === "flat" ? (
				<>
					{scopeManager.scopes.map((subScope, index) => (
						<ScopeItem
							key={index}
							data={subScope}
							index={index + 1}
						/>
					))}
				</>
			) : (
				<ScopeItem data={scopeManager.globalScope} index={-1} />
			)}
		</Accordion>
	);
};
