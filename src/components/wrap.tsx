import { WrapTextIcon } from "lucide-react";
import { useExplorer } from "@/hooks/use-explorer";
import { mergeClassNames } from "@/lib/utils";
import { Button } from "./ui/button";
import type { FC } from "react";

export const Wrap: FC = () => {
	const {
		tool,
		viewModes: { astView, pathView },
		wrap,
		setWrap,
	} = useExplorer();

	const isAstViewNotJson = tool === "ast" && astView !== "json";
	const isPathViewNotCode = tool === "path" && pathView !== "code";

	if (isAstViewNotJson || isPathViewNotCode) return null;

	return (
		<Button
			onClick={() => setWrap(!wrap)}
			variant={wrap ? "outline" : "ghost"}
			className={mergeClassNames(
				"flex items-center gap-2",
				!wrap && "text-muted-foreground border border-transparent",
			)}
		>
			<WrapTextIcon size={16} />
			<span>Wrap</span>
		</Button>
	);
};
