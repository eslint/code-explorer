import { CallToAction } from "@/components/cta";
import { ModeToggle } from "@/components/mode-toggle";
import { Options } from "@/components/options";
import type { FC } from "react";

export const Navbar: FC = () => (
	<nav className="border-t-4 border-primary">
		<div className="px-6 py-4 flex items-center justify-between text-xl font-semibold">
			<div className="flex items-center gap-1.5">
				<a
					href="https://eslint.org/"
					aria-label="Homepage"
					className="flex"
				>
					<img
						src="/languages/eslint.svg"
						alt="Code Explorer"
						width={32}
						height={32}
					/>
					<p className="hidden sm:block ml-1">ESLint</p>
					<p className="hidden sm:block text-muted-foreground ml-1">
						Code Explorer
					</p>
				</a>
			</div>
			<div className="flex items-center gap-2">
				<ModeToggle />
				<Options />
				<CallToAction />
			</div>
		</div>
	</nav>
);
