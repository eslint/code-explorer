import type { FC } from "react";
import { useAST } from "@/components/ast-provider";
import { Editor } from "@/components/editor";
import { useExplorer } from "@/hooks/use-explorer";
import { convertNodesToRanges } from "@/lib/convert-nodes-to-ranges";

export const CodeEditor: FC = () => {
	const { language, code, setCode } = useExplorer();
	const astParseResult = useAST();

	return (
		<Editor
			ariaLabel="Code Editor"
			value={code[language]}
			highlightedRanges={
				astParseResult.ok
					? convertNodesToRanges(astParseResult.esqueryMatchedNodes)
					: undefined
			}
			onChange={value => {
				setCode({
					...code,
					[language]: value,
				});
			}}
		/>
	);
};
