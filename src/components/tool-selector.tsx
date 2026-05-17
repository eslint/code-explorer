import { Button } from "@/components/ui/button";
import { useExplorer } from "@/hooks/use-explorer";
import { tools } from "@/lib/tools";
import type { FC } from "react";

export const ToolSelector: FC = () => {
	const explorer = useExplorer();

	const availableTools =
		explorer.language === "javascript" ? tools : [tools[0]];

	return (
		<div className="flex items-center gap-1">
			{availableTools.map(({ name, value }) => (
				<Button
					key={value}
					variant={value === explorer.tool ? "outline" : "ghost"}
					className={
						value === explorer.tool
							? ""
							: "border border-transparent text-muted-foreground"
					}
					onClick={() =>
						explorer.setTool(value as typeof explorer.tool)
					}
				>
					{name}
				</Button>
			))}
		</div>
	);
};
