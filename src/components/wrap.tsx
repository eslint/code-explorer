"use client";

import { WrapTextIcon } from "lucide-react";
import { useExplorer } from "@/hooks/use-explorer";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import type { FC } from "react";

export const Wrap: FC = () => {
	const {
		tool,
		viewModes: { astView, pathView },
		wrap,
		setWrap,
	} = useExplorer();

	if (tool === "ast" && astView !== "json") {
		return null;
	}

	if (tool === "path" && pathView !== "code") {
		return null;
	}

	return (
		<Button
			onClick={() => setWrap(!wrap)}
			variant={wrap ? "outline" : "ghost"}
			className={cn(
				"flex items-center gap-2",
				!wrap && "text-muted-foreground border border-transparent",
			)}
		>
			<WrapTextIcon size={16} />
			<span>Wrap</span>
		</Button>
	);
};
