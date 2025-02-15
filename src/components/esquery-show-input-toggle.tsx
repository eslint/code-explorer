"use client";

import type { FC } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useExplorer } from "@/hooks/use-explorer";

export const EsqueryShowInputToggle: FC = () => {
	const explorer = useExplorer();
	const { jsOptions, setJsOptions } = explorer;
	const { esquerySelectorEnabled } = jsOptions;

	return (
		<div className="flex items-center gap-1.5 px-2">
			<Switch
				id="esquerySelector"
				checked={esquerySelectorEnabled}
				onCheckedChange={(value: boolean) => {
					setJsOptions({
						...jsOptions,
						esquerySelectorEnabled: value,
					});
				}}
			/>
			<Label htmlFor="esquerySelector">Show ESQuery Selector</Label>
		</div>
	);
};
