import { useId, type FC } from "react";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { useExplorer } from "@/hooks/use-explorer";

export const EsquerySelectorInput: FC = () => {
	const { esquerySelector, setEsquerySelector } = useExplorer();
	const htmlId = useId();

	return (
		<div className="p-2 flex gap-1.5 items-center border-b">
			<Label htmlFor={htmlId} className="whitespace-pre">
				ESQuery Selector
			</Label>
			<TextField
				id={htmlId}
				className="flex-1"
				value={esquerySelector.selector}
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
