import type { JsOptions } from "@/hooks/use-explorer";
import * as espree from "espree";

export function parseJavascriptAST(opts: {
	code: string;
	jsOptions: JsOptions;
}) {
	return espree.parse(opts.code, {
		ecmaVersion: opts.jsOptions.esVersion,
		sourceType: opts.jsOptions.sourceType,
		ecmaFeatures: {
			jsx: opts.jsOptions.isJSX,
		},
	});
}
