import { useExplorer } from "@/hooks/use-explorer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { scopeViewOptions } from "@/lib/const";
import { mergeClassNames } from "@/lib/utils";
import type { FC } from "react";

export const ScopeViewMode: FC = () => {
	const explorer = useExplorer();
	const { viewModes, setViewModes } = explorer;
	const { scopeView } = viewModes;

	const handleValueChange = (value: string) => {
		if (!value) {
			return;
		}

		setViewModes({ ...viewModes, scopeView: value as "nested" | "flat" });
	};

	return (
		<ToggleGroup
			type="single"
			value={scopeView}
			onValueChange={handleValueChange}
			className="border rounded-md border-card"
		>
			{scopeViewOptions.map(option => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					className={mergeClassNames(
						"border border-card -m-px flex items-center gap-1.5",
						option.value === scopeView
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
