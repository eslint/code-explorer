import type { FC } from "react";
import { useExplorer } from "@/hooks/use-explorer";
import { pathViewOptions } from "@/lib/const";
import { ViewModeToggle } from "@/components/view-mode-toggle";

export const PathViewMode: FC = () => {
	const explorer = useExplorer();
	const { viewModes, setViewModes } = explorer;
	const { pathView } = viewModes;

	return (
		<ViewModeToggle
			value={pathView}
			options={pathViewOptions}
			onValueChange={value =>
				setViewModes({
					...viewModes,
					pathView: value as "code" | "graph",
				})
			}
		/>
	);
};
