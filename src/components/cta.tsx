import { ExternalLinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { FC } from "react";

export const CallToAction: FC = () => (
	<div className="light">
		<Button asChild size="sm">
			<a
				href="https://github.com/eslint/code-explorer"
				target="_blank"
				rel="noreferrer"
			>
				<span className="hidden sm:block">GitHub</span>
				<span className="sm:hidden">
					<ExternalLinkIcon size={16} />
				</span>
			</a>
		</Button>
	</div>
);
