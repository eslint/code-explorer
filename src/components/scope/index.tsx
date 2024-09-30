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
	const { code, jsOptions, viewModes } = explorer;
	const { javascript } = code;
	const { sourceType, esVersion, isJSX } = jsOptions;
	const { scopeView } = viewModes;
	let ast = {};
	let scopeManager = null;

	try {
		ast = espree.parse(javascript, {
			range: true,
			ecmaVersion: esVersion,
			sourceType: sourceType,
			ecmaFeatures: {
				jsx: isJSX,
			},
		});
		scopeManager = eslintScope.analyze(ast, {
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
			className="px-8 pb-2 font-mono space-y-3"
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
						/>
					))}
				</>
			) : (
				<ScopeItem
					isArray={Array.isArray(scopeManager.globalScope)}
					data={scopeManager.globalScope}
					path={"-1"}
					index={-1}
				/>
			)}
		</Accordion>
	);
};
