import { useEffect, useRef, useState } from "react";
import { useExplorer } from "@/hooks/use-explorer";
import { Editor } from "../editor";
import type { FC } from "react";
import Graphviz from "graphviz-react";
import { generateCodePath, type CodePathData } from "@/lib/generate-code-path";
import { parseError } from "@/lib/parse-error";
import { ErrorState } from "@/components/error-boundary";

export const CodePath: FC = () => {
	const explorer = useExplorer();
	const { code, jsOptions, pathIndex, setPathIndex, viewModes } = explorer;
	const { javascript } = code;
	const { sourceType, esVersion, isJSX } = jsOptions;
	const { pathView } = viewModes;
	const { index, indexes } = pathIndex;
	const [extracted, setExtracted] = useState<CodePathData[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const hasMountedDebouncedEffect = useRef(false);

	useEffect(() => {
		const fetchCodePath = () => {
			try {
				const response = generateCodePath(
					javascript,
					esVersion,
					sourceType,
					isJSX,
				);
				if ("error" in response) {
					throw new Error(response.error);
				}
				const newExtracted = response.response;
				if (newExtracted.length < indexes) {
					setPathIndex({
						index: 0,
						indexes: newExtracted.length,
					});
				} else {
					setPathIndex({
						index,
						indexes: newExtracted.length,
					});
				}
				setError(null);
				setExtracted(newExtracted);
			} catch (newError) {
				setError(parseError(newError));
			}
		};

		if (!hasMountedDebouncedEffect.current) {
			hasMountedDebouncedEffect.current = true;
			fetchCodePath();
			return;
		}

		const timeoutId = setTimeout(() => {
			fetchCodePath();
		}, 500);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [
		javascript,
		esVersion,
		sourceType,
		isJSX,
		index,
		indexes,
		setPathIndex,
	]);

	if (error) {
		return <ErrorState message={error} />;
	}

	if (!extracted) {
		return null;
	}

	const codePath = extracted[index].dot;

	if (pathView === "code") {
		return <Editor ariaLabel="Code Path" readOnly value={codePath} />;
	}

	return <Graphviz dot={codePath} />;
};
