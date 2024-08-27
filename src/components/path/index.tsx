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
	const [extracted, setExtracted] = useState<ParsedResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useDebouncedEffect(
		() => {
			generateCodePath(
				explorer.jsCode,
				explorer.esVersion,
				explorer.sourceType,
			)
				.then(response => {
					if ("error" in response) {
						throw new Error(response.error);
					}

					return JSON.parse(response.response) as ParsedResponse;
				})
				.then(newExtracted => {
					if (
						newExtracted.codePathList.length > explorer.pathIndexes
					) {
						explorer.setPathIndex(0);
					}

					explorer.setPathIndexes(newExtracted.codePathList.length);

					setError(null);

					return newExtracted;
				})
				.then(setExtracted)
				.catch(newError => setError(parseError(newError)));
		},
		500,
		[
			explorer,
			explorer.jsCode,
			explorer.esVersion,
			explorer.sourceType,
			explorer.setPathIndexes,
			explorer.pathIndexes,
		],
	);

	if (error) {
		return (
			<div className="bg-red-50 -mt-[72px] pt-[72px] h-full">
				<div className="p-4 text-red-700">{error}</div>
			</div>
		);
	}

	if (!extracted) {
		return null;
	}

	const code = extracted.codePathList[explorer.pathIndex].dot;

	if (explorer.pathViewMode === "code") {
		return <Editor readOnly value={code} />;
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
				<Graphviz dot={code} />
			</div>
		</>
	);
};
