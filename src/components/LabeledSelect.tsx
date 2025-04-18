"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Version } from "@/hooks/use-explorer";
import { Label } from "./ui/label";

type OnValueChangeType = (value: string) => void;
type ItemsType = {
	value: string | Version;
	label: string;
	icon?: string;
};
interface PanelProps {
	id: string;
	label: string;
	value: string;
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
				<SelectTrigger id={id} className="w-full" disabled={isDisabled}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{items.map(item => (
						<SelectItem
							key={item.value}
							value={item.value as string}
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
