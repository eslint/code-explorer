import * as espree from "espree";
import css from "@eslint/css";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { useExplorer } from "@/hooks/use-explorer";

export function useAST() {
	const {
		language,
		code,
		jsOptions,
		cssOptions,
		jsonOptions,
		markdownOptions,
	} = useExplorer();

	let result:
		| { ok: true; ast: unknown }
		| { ok: false; errors: Array<unknown> };

	switch (language) {
		case "javascript": {
			try {
				const ast = espree.parse(code.javascript, {
					ecmaVersion: jsOptions.esVersion,
					sourceType: jsOptions.sourceType,
					ecmaFeatures: {
						jsx: jsOptions.isJSX,
					},
				});
				result = { ast, ok: true };
			} catch (err) {
				// error occured e.g. because the JS code cannot be parsed into an AST, or the esquery selector is no valid selector --> just ignore (no highlighted ranges)
				result = { ok: false, errors: [err] };
			}
			break;
		}

		case "json": {
			const { jsonMode } = jsonOptions;
			const language = json.languages[jsonMode];
			result = language.parse({ body: code.json });
			break;
		}

		case "markdown": {
			const { markdownMode } = markdownOptions;
			const language = markdown.languages[markdownMode];
			result = language.parse({ body: code.markdown });
			break;
		}

		case "css": {
			const { cssMode, tolerant } = cssOptions;
			const language = css.languages[cssMode];
			result = language.parse(
				{ body: code.css },
				{ languageOptions: { tolerant } },
			);
			break;
		}
	}

	return result;
}
