/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./{pages,components,app,src}/**/*.{ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				"scrollbar-thumb": "hsl(var(--scrollbar-thumb))",
				"scrollbar-thumb-hover": "hsl(var(--scrollbar-thumb-hover))",
				"scrollbar-track": "hsl(var(--scrollbar-track))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				dropContainer: "hsl(var(--drop-container-bg-color))",
				dropMessage: "hsl(var(--drop-message-bg-color))",
				editorBackground: "hsl(var(--editor-background))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			backgroundImage: {
				gutter: "url('./assets/gutter.png')",
			},
			backgroundPosition: {
				center: "50%",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		function ({ addUtilities, theme }) {
			addUtilities(
				{
					".scrollbar-thumb": {
						scrollbarColor: `${theme("colors.scrollbar-thumb")} ${theme("colors.scrollbar-track")}`,
					},
					".scrollbar-thumb-hover": {
						scrollbarColor: `${theme("colors.scrollbar-thumb-hover")} ${theme("colors.scrollbar-track")}`,
					},
					".scrollbar-track": {
						scrollbarWidth: "thin",
					},
				},
				["responsive", "hover"],
			);
		},
	],
	purge: {
		content: ["./{pages,components,app,src}/**/*.{ts,tsx}"],
		options: {
			safelist: ["cm-editor", "cm-gutter", "ͼ1", "cm-focused"],
		},
	},
};
