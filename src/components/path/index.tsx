"use client";

import { useState } from "react";
import { useExplorer } from "@/hooks/use-explorer";
import { Editor } from "../editor";
import type { FC } from "react";
import Graphviz from "graphviz-react";
import { generateCodePath } from "@/lib/generate-code-path";
import { parseError } from "@/lib/parse-error";
import useDebouncedEffect from "use-debounced-effect";

type ParsedResponse = {
	codePathList: {
		dot: string;
	}[];
};

export const CodePath: FC = () => {
	const explorer = useExplorer();
	const { code, jsOptions, pathIndex, setPathIndex, viewModes } = explorer;
	const { javascript } = code;
	const { sourceType, esVersion } = jsOptions;
	const { pathView } = viewModes;
	const { index, indexes } = pathIndex;
	const [extracted, setExtracted] = useState<ParsedResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useDebouncedEffect(
		() => {
			generateCodePath(javascript, esVersion, sourceType)
				.then(response => {
					if ("error" in response) {
						throw new Error(response.error);
					}

					return JSON.parse(response.response) as ParsedResponse;
				})
				.then(newExtracted => {
					if (newExtracted.codePathList.length < indexes) {
						setPathIndex({
							index: 0,
							indexes: newExtracted.codePathList.length,
						});
					} else {
						setPathIndex({
							...pathIndex,
							indexes: newExtracted.codePathList.length,
						});
					}
					setError(null);
					return newExtracted;
				})
				.then(setExtracted)
				.catch(newError => setError(parseError(newError)));
		},
		500,
		[javascript, esVersion, sourceType, index, indexes],
	);

	if (error) {
		return (
			<div className="bg-red-50 dark:bg-gray-900 pl-1.5 pt-1.5 h-full">
				<div className="p-4 text-red-600 dark:text-red-400">
					Error: {error}
				</div>
			</div>
		);
	}

	if (!extracted) {
		return null;
	}

	const codePath = extracted.codePathList[index].dot;

	if (pathView === "code") {
		return <Editor readOnly value={codePath} />;
	}

	return (
		<>
			<svg
				className="absolute w-full h-full select-none pointer-events-none z-0"
				data-testid="rf__background"
				aria-label="Canvas background"
			>
				<pattern
					id="pattern"
					x="10"
					y="14"
					width="20"
					height="20"
					patternUnits="userSpaceOnUse"
					patternTransform="translate(-0.5,-0.5)"
				>
					<circle
						cx="0.5"
						cy="0.5"
						r="0.5"
						className="fill-muted-foreground"
					/>
				</pattern>
				<rect
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill="url(#pattern)"
				/>
			</svg>
			<div className="relative z-10">
				<Graphviz dot={codePath} />
			</div>
		</>
	);
};
