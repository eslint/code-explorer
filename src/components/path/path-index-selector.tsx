"use client";

import { useExplorer } from "@/hooks/use-explorer";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { FC } from "react";

export const PathIndexSelector: FC = () => {
	const explorer = useExplorer();
	const { pathIndex, setPathIndex } = explorer;

	const handleChange = (value: string) => {
		setPathIndex({ ...pathIndex, index: Number(value) });
	};

	return (
		<Select value={String(pathIndex.index)} onValueChange={handleChange}>
			<SelectTrigger className="w-[10rem]">
				<SelectValue placeholder="Code Path" />
			</SelectTrigger>
			<SelectContent>
				{Array.from({ length: pathIndex.indexes }).map(
					(item, index) => (
						<SelectItem key={index} value={String(index)}>
							Code Path {index + 1}
						</SelectItem>
					),
				)}
			</SelectContent>
		</Select>
	);
};
