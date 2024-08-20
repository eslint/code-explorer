import { ModeToggle } from "./mode-toggle";
import { Options } from "./options";
import { CallToAction } from "./cta";
import type { FC } from "react";

export const Navbar: FC = () => (
	<nav className="border-t-4 border-primary">
		<div className="px-6 py-4 flex items-center justify-between text-xl font-semibold">
			<div className="flex items-center gap-1.5">
				<img
					src="/languages/eslint.svg"
					alt="Code Explorer"
					width={32}
					height={32}
				/>
				<p className="hidden sm:block">ESLint</p>
				<p className="hidden sm:block text-muted-foreground">
					Code Explorer
				</p>
			</div>
			<div className="flex items-center gap-2">
				<ModeToggle />
				<Options />
				<CallToAction />
			</div>
		</div>
	</nav>
);
