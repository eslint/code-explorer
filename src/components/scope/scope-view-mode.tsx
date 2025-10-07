import type { FC } from "react";
import { useExplorer } from "@/hooks/use-explorer";
import { scopeViewOptions } from "@/lib/const";
import { ViewModeToggle } from "@/components/view-mode-toggle";

export const ScopeViewMode: FC = () => {
	const explorer = useExplorer();
	const { viewModes, setViewModes } = explorer;
	const { scopeView } = viewModes;

	return (
		<ViewModeToggle
			value={scopeView}
			options={scopeViewOptions}
			onValueChange={value =>
				setViewModes({
					...viewModes,
					scopeView: value as "nested" | "flat",
				})
			}
			groupClassName="border-card"
			itemClassName="border-card"
		/>
	);
};
