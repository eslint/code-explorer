"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SourceType, Version } from "@/hooks/use-explorer";
import { Label } from "./ui/label";

type OnValueChangeType =
	| ((string: string) => void)
	| ((mode: "json" | "jsonc" | "json5") => void)
	| ((mode: "commonmark" | "gfm") => void);
type ItemsType = {
	value: string | Version;
	label: string;
	icon?: string;
};
interface PanelProps {
	id: string;
	label: string;
	value: string | SourceType;
	onValueChange: OnValueChangeType;
	items: ItemsType[];
	placeholder: string;
	isDisabled?: boolean;
	icon?: boolean;
}

const LabeledSelect = (props: PanelProps) => {
	const {
		id,
		label,
		value,
		onValueChange,
		items,
		placeholder,
		isDisabled = false,
		icon = false,
	} = props;
	return (
		<div className="space-y-1.5">
			<Label htmlFor={id}>{label}</Label>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger className="w-full" disabled={isDisabled}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{items.map(item => (
						<SelectItem
							key={item.value}
							value={item.value.toString()}
						>
							{icon && (
								<div className="flex items-center gap-1.5">
									<img
										src={item.icon}
										alt={item.label}
										width={16}
										height={16}
										className="w-4 h-4"
									/>
									<span>{item.label}</span>
								</div>
							)}
							{!icon && item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default LabeledSelect;
