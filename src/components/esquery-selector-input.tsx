import { useId, type FC } from "react";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { useExplorer, type Language } from "@/hooks/use-explorer";
import { useAST } from "@/hooks/use-ast";
import { cn } from "@/lib/utils";

const esquerySelectorPlaceholder = (language: Language) => {
	switch (language) {
		case "javascript":
			return 'e.g. "ImportDeclaration > Literal"';
		case "json":
			return 'e.g. "Member > String"';
		case "markdown":
			return 'e.g. "Heading > Text"';
		case "css":
			return 'e.g. "Block > Declaration"';
		case "html":
			return 'e.g. "Document > Doctype"';
	}
};

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
				placeholder={esquerySelectorPlaceholder(language)}
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
