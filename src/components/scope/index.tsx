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
		ast = espree.parse(explorer.jsCode, {
			range: true,
			ecmaVersion: explorer.esVersion,
			sourceType: explorer.sourceType,
			ecmaFeatures: {
				jsx: explorer.isJSX,
			},
		});
		scopeManager = eslintScope.analyze(ast, {
			sourceType: explorer.sourceType as never,
			ecmaVersion:
				explorer.esVersion === "latest"
					? espree.latestEcmaVersion
					: explorer.esVersion,
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
