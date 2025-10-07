import type { FC } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type LabeledSwitchProps = {
	id: string;
	label: string;
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
};

export const LabeledSwitch: FC<LabeledSwitchProps> = ({
	id,
	label,
	checked,
	onCheckedChange,
}) => {
	return (
		<div className="flex items-center gap-1.5">
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
			<Label htmlFor={id}>{label}</Label>
		</div>
	);
};
