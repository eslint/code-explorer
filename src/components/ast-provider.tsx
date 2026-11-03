import { createContext, useContext, useMemo } from "react";
import * as espree from "espree";
import esquery from "esquery";
import type { Node as EstreeNode } from "estree";
import type { ParseResult, FileError } from "@eslint/core";
import css from "@eslint/css";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import html from "@html-eslint/eslint-plugin";
import { useExplorer, type ExplorerState } from "@/hooks/use-explorer";
import { assertIsUnreachable } from "@/lib/utils";
import { templateEngineSyntaxPresets } from "@/lib/const";

type ParseInput = Pick<
	ExplorerState,
	| "language"
	| "code"
	| "jsOptions"
	| "cssOptions"
	| "jsonOptions"
	| "markdownOptions"
	| "htmlOptions"
>;

type ASTResult = ReturnType<typeof addEsqueryMatchedNodes>;

type ASTProviderProps = {
	children: React.ReactNode;
};

const ASTProviderContext = createContext<ASTResult | null>(null);

export const ASTProvider: React.FC<ASTProviderProps> = ({ children }) => {
	const {
		language,
		code,
		jsOptions,
		cssOptions,
		jsonOptions,
		markdownOptions,
		htmlOptions,
		esquerySelector,
	} = useExplorer();
	const selector = esquerySelector?.selector ?? "";

	const astParseResult = useMemo(
		() =>
			parseCode({
				language,
				code,
				jsOptions,
				cssOptions,
				jsonOptions,
				markdownOptions,
				htmlOptions,
			}),
		[
			language,
			code,
			jsOptions,
			cssOptions,
			jsonOptions,
			markdownOptions,
			htmlOptions,
		],
	);
	const astResult = useMemo(
		() => addEsqueryMatchedNodes(astParseResult, selector),
		[astParseResult, selector],
	);

	return (
		<ASTProviderContext value={astResult}>{children}</ASTProviderContext>
	);
};

export function useAST() {
	const context = useContext(ASTProviderContext);
	if (!context) {
		throw new Error("useAST must be used within an ASTProvider");
	}
	return context;
}

function parseCode({
	language,
	code,
	jsOptions,
	cssOptions,
	jsonOptions,
	markdownOptions,
	htmlOptions,
}: ParseInput): ParseResult<unknown> {
	switch (language) {
		case "javascript": {
			try {
				const ast = espree.parse(code.javascript, {
					range: true,
					loc: true,
					comment: true,
					tokens: true,
					ecmaVersion: jsOptions.esVersion,
					sourceType: jsOptions.sourceType,
					ecmaFeatures: {
						jsx: jsOptions.isJSX,
					},
				});
				return { ast, ok: true };
			} catch (err) {
				// espree throws if the JS code cannot be parsed into an AST --> return the error, so that it is shown instead of the AST
				return { ok: false, errors: [err as FileError] };
			}
		}

		case "json": {
			const { jsonMode, allowTrailingCommas } = jsonOptions;
			const language = json.languages[jsonMode];
			return language.parse(
				{
					body: code.json,
					path: "",
					physicalPath: "",
					bom: false,
				},
				{
					languageOptions: {
						allowTrailingCommas,
					},
				},
			);
		}

		case "markdown": {
			const { markdownMode, markdownFrontmatter, markdownMath } =
				markdownOptions;
			const language = markdown.languages[markdownMode];
			return language.parse(
				{ body: code.markdown, path: "", physicalPath: "", bom: false },
				{
					languageOptions: {
						frontmatter:
							markdownFrontmatter === "off"
								? false
								: markdownFrontmatter,
						math: markdownMath,
					},
				},
			);
		}

		case "css": {
			const { cssMode, tolerant } = cssOptions;
			const language = css.languages[cssMode];
			return language.parse(
				{ body: code.css, path: "", physicalPath: "", bom: false },
				{ languageOptions: { tolerant } },
			);
		}

		case "html": {
			const { templateEngineSyntax, frontmatter } = htmlOptions;
			const language = html.languages!.html;
			return language.parse(
				{
					body: code.html,
					path: "",
					physicalPath: "",
					bom: false,
				},
				{
					languageOptions: {
						templateEngineSyntax:
							templateEngineSyntaxPresets[templateEngineSyntax],
						frontmatter,
					},
				},
			);
		}

		default: {
			assertIsUnreachable(language);
		}
	}
}

function addEsqueryMatchedNodes(
	astParseResult: ParseResult<unknown>,
	selector: string,
) {
	if (astParseResult.ok) {
		const esqueryMatchedNodes = getEsqueryMatchedNodes(
			astParseResult.ast,
			selector,
		);

		return {
			...astParseResult,
			esqueryMatchedNodes,
		};
	} else {
		return astParseResult;
	}
}

function getEsqueryMatchedNodes(ast: unknown, esquerySelector: string) {
	if (esquerySelector.trim().length > 0) {
		try {
			const esqueryMatchedNodes = esquery.match(
				ast as EstreeNode,
				esquery.parse(esquerySelector),
			) as unknown[];
			return esqueryMatchedNodes;
		} catch {
			// error occurred e.g. because the esquery selector is no valid selector --> just ignore (no nodes matched --> no highlighted ranges)
		}
	}
	return [];
}
