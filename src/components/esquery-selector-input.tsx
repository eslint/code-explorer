import { useId, type FC } from "react";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { useExplorer } from "@/hooks/use-explorer";
import { useAST } from "@/hooks/use-ast";
import { cn } from "@/lib/utils";
import { esquerySelectorPlaceholder } from "@/lib/const";

export const EsquerySelectorInput: FC = () => {
	const { esquerySelector, setEsquerySelector, language } = useExplorer();
	const astParseResult = useAST();
	const htmlId = useId();

	const highlightAsNotMatching =
		esquerySelector?.selector.trim() &&
		(!astParseResult.ok || astParseResult.esqueryMatchedNodes.length === 0);

	return (
		<div className="p-2 flex gap-1.5 items-center border-b">
			<Label htmlFor={htmlId} className="whitespace-pre">
				ESQuery Selector
			</Label>
			<TextField
				id={htmlId}
				placeholder={esquerySelectorPlaceholder[language]}
				className={cn(
					"flex-1",
					!astParseResult.ok ||
						(highlightAsNotMatching &&
							"bg-nonmatchingEsquerySelector hover:bg-nonmatchingEsquerySelector"),
				)}
				value={esquerySelector?.selector ?? ""}
				onChange={e =>
					setEsquerySelector({
						...esquerySelector,
						selector: e.target.value,
					})
				}
			/>
		</div>
	);
};
