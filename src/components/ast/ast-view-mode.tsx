import type { FC } from "react";
import { useExplorer } from "@/hooks/use-explorer";
import { astViewOptions } from "@/lib/const";
import { ViewModeToggle } from "@/components/view-mode-toggle";

export const AstViewMode: FC = () => {
	const { viewModes, setViewModes } = useExplorer();
	const { astView } = viewModes;

	return (
		<ViewModeToggle
			value={astView}
			options={astViewOptions}
			onValueChange={value =>
				setViewModes({
					...viewModes,
					astView: value as "tree" | "json",
				})
			}
		/>
	);
};
