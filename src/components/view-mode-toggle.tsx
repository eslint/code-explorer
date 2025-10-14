import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { mergeClassNames } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { FC } from "react";

type ViewModeOption = {
	value: string;
	label: string;
	icon: LucideIcon;
};

type ViewModeToggleProps = {
	value: string;
	options: ViewModeOption[];
	onValueChange: (value: string) => void;
	groupClassName?: string;
	itemClassName?: string;
};

export const ViewModeToggle: FC<ViewModeToggleProps> = ({
	value,
	options,
	onValueChange,
	groupClassName,
	itemClassName,
}) => {
	const handleValueChange = (val: string) => {
		if (!val) return;
		onValueChange(val);
	};

	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={handleValueChange}
			className={mergeClassNames("border rounded-md", groupClassName)}
		>
			{options.map(option => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					className={mergeClassNames(
						"border -m-px flex items-center gap-1.5",
						itemClassName,
						option.value === value
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
