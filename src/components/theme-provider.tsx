import { createContext, useContext, useEffect, useState } from "react";
import { getPreferredColorScheme } from "../lib/utils";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}) => {
	const [theme, setThemeState] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		const appliedTheme =
			theme === "system" ? getPreferredColorScheme() : theme;
		root.classList.add(appliedTheme);
	}, [theme]);

	const setTheme = (newTheme: Theme) => {
		localStorage.setItem(storageKey, newTheme);
		setThemeState(newTheme);
	};

	return (
		<ThemeProviderContext {...props} value={{ theme, setTheme }}>
			{children}
		</ThemeProviderContext>
	);
};

export const useTheme = (): ThemeProviderState => {
	const context = useContext(ThemeProviderContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
