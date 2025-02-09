import { useId, type FC } from "react";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { useExplorer } from "@/hooks/use-explorer";

export const EsquerySelectorInput: FC = () => {
	const { esquerySelector, setEsquerySelector } = useExplorer();
	const htmlId = useId();

	return (
		<div className="space-y-1.5 m-2">
			<Label htmlFor={htmlId}>esquery Selector</Label>
			<TextField
				id={htmlId}
				className="w-full"
				value={esquerySelector}
				onChange={e => setEsquerySelector(e.target.value)}
			/>
		</div>
	);
};
