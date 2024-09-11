"use client";

import { useExplorer } from "@/hooks/use-explorer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { astViewOptions } from "@/lib/const";
import { cn } from "@/lib/utils";
import type { FC } from "react";

export const AstViewMode: FC = () => {
	const explorer = useExplorer();
	const { viewModes, setViewModes } = explorer;
	const { astView } = viewModes;

	const handleValueChange = (value: string) => {
		if (!value) {
			return;
		}

		setViewModes({ ...viewModes, astView: value as "tree" | "json" });
	};

	return (
		<ToggleGroup
			type="single"
			value={astView}
			onValueChange={handleValueChange}
			className="border rounded-md"
		>
			{astViewOptions.map(option => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					className={cn(
						"border -m-px flex items-center gap-1.5",
						option.value === astView
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
