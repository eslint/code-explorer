"use client";

import { useExplorer } from "@/hooks/use-explorer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pathViewOptions } from "@/lib/const";
import { cn } from "@/lib/utils";
import type { FC } from "react";

export const PathViewMode: FC = () => {
	const explorer = useExplorer();
	const { viewModes, setViewModes } = explorer;
	const { pathView } = viewModes;

	const handleValueChange = (value: string) => {
		if (!value) {
			return;
		}

		setViewModes({ ...viewModes, pathView: value as "code" | "graph" });
	};

	return (
		<ToggleGroup
			type="single"
			value={pathView}
			onValueChange={handleValueChange}
			className="border rounded-md"
		>
			{pathViewOptions.map(option => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					className={cn(
						"border -m-px flex items-center gap-1.5",
						option.value === pathView
							? "!bg-background"
							: "border-transparent hover:bg-transparent text-muted-foreground",
					)}
				>
					<option.icon size={16} />
					{option.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
};
