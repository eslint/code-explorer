"use client";

import * as espree from "espree";
import * as eslintScope from "eslint-scope";
import { useExplorer } from "@/hooks/use-explorer";
import { Accordion } from "@/components/ui/accordion";
import { ScopeItem } from "./scope-item";
import type { FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";
import { useAST } from "@/hooks/use-ast";

export const Scope: FC = () => {
	const explorer = useExplorer();
	const result = useAST();
	const { jsOptions, viewModes } = explorer;
	const { sourceType, esVersion } = jsOptions;
	const { scopeView } = viewModes;
	let scopeManager = null;

	if (!result.ok) {
		const message = parseError(result.errors[0]);
		return <ErrorState message={message} />;
	}

	try {
		scopeManager = eslintScope.analyze(result.ast as object, {
			sourceType: sourceType as never,
			ecmaVersion:
				esVersion === "latest" ? espree.latestEcmaVersion : esVersion,
		});
	} catch (error) {
		const message = parseError(error);
		return <ErrorState message={message} />;
	}

	return (
		<Accordion
			type="multiple"
			className="px-8 pb-4 font-mono space-y-3 min-w-max"
			defaultValue={["0-global"]}
		>
			{scopeView === "flat" ? (
				<>
					{scopeManager.scopes.map((subScope, index) => (
						<ScopeItem
							isArray={Array.isArray(scopeManager.scopes)}
							key={index}
							data={subScope}
							path={index.toString()}
							index={index + 1}
							esqueryMatchedNodes={result.esqueryMatchedNodes}
						/>
					))}
				</>
			) : (
				<ScopeItem
					isArray={Array.isArray(scopeManager.globalScope)}
					data={scopeManager.globalScope}
					path={"-1"}
					index={-1}
					esqueryMatchedNodes={result.esqueryMatchedNodes}
				/>
			)}
		</Accordion>
	);
};
