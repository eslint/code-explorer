"use client";

import { MoonIcon, SunIcon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FC } from "react";
import { useTheme } from "./theme-provider";

const icons = {
	light: (
		<SunIcon className="h-5 w-5 transition-transform dark:-rotate-90 dark:scale-0" />
	),
	dark: (
		<MoonIcon className="h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
	),
	system: <Monitor className="h-5 w-5 text-black dark:text-white" />,
};

const ThemeIcon: FC<{ theme: keyof typeof icons }> = ({ theme }) =>
	icons[theme];

export const ModeToggle: FC = () => {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<ThemeIcon theme={theme} />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
