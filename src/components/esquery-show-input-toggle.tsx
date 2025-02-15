"use client";

import type { FC } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useExplorer } from "@/hooks/use-explorer";

export const EsqueryShowInputToggle: FC = () => {
	const explorer = useExplorer();
	const { esquerySelector, setEsquerySelector } = explorer;

	return (
		<div className="flex items-center gap-1.5 px-2">
			<Switch
				id="esquerySelector"
				checked={esquerySelector.enabled}
				onCheckedChange={(value: boolean) => {
					setEsquerySelector({
						...esquerySelector,
						enabled: value,
					});
				}}
			/>
			<Label htmlFor="esquerySelector">Show ESQuery Selector</Label>
		</div>
	);
};
