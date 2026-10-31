import * as espree from "espree";
import * as eslintScope from "eslint-scope";
import { useExplorer, type JsOptions } from "@/hooks/use-explorer";
import { Accordion } from "@/components/ui/accordion";
import { ScopeItem } from "./scope-item";
import type { Program } from "estree";
import { useMemo, type FC } from "react";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "../error-boundary";
import { useAST } from "@/components/ast-provider";

type ScopeAnalysisResult =
	| { ok: true; scopeManager: eslintScope.ScopeManager }
	| { ok: false; error: unknown };

export const Scope: FC = () => {
	const explorer = useExplorer();
	const result = useAST();
	const { jsOptions, viewModes } = explorer;
	const { scopeView } = viewModes;

	const scopeAnalysis = useMemo(
		() => (result.ok ? analyzeScope(result.ast, jsOptions) : null),
		[result.ok, result.ast, jsOptions],
	);

	if (!result.ok) {
		const message = parseError(result.errors[0]);
		return <ErrorState message={message} />;
	}

	if (!scopeAnalysis?.ok) {
		const message = parseError(scopeAnalysis?.error);
		return <ErrorState message={message} />;
	}

	const { scopeManager } = scopeAnalysis;

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

function analyzeScope(
	ast: unknown,
	{ sourceType, esVersion, isJSX }: JsOptions,
): ScopeAnalysisResult {
	try {
		const scopeManager = eslintScope.analyze(ast as Program, {
			sourceType,
			ecmaVersion:
				esVersion === "latest" ? espree.latestEcmaVersion : esVersion,
			jsx: isJSX,
		});
		return { ok: true, scopeManager };
	} catch (error) {
		return { ok: false, error };
	}
}
