import { useId, type FC } from "react";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { useExplorer } from "@/hooks/use-explorer";

export const EsquerySelectorInput: FC = () => {
	const { esquerySelector, setEsquerySelector } = useExplorer();
	const htmlId = useId();

	return (
		<div className="p-2 flex flex-row gap-1.5 items-center border-b">
			<Label htmlFor={htmlId} className="whitespace-pre">
				esquery Selector
			</Label>
			<TextField
				id={htmlId}
				className="flex-1"
				value={esquerySelector}
				onChange={e => setEsquerySelector(e.target.value)}
			/>
		</div>
	);
};
