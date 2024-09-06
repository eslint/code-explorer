"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useExplorer } from "@/hooks/use-explorer";
import {
	jsonModes,
	markdownModes,
	languages,
	parsers,
	sourceTypes,
	versions,
} from "@/lib/const";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import type { FC } from "react";
import { Settings } from "lucide-react";
import LabeledSelect from "./LabeledSelect";

const JSONPanel: React.FC = () => {
	const explorer = useExplorer();
	return (
		<LabeledSelect
			id="jsonMode"
			label="Mode"
			value={explorer.jsonMode}
			onValueChange={explorer.setJsonMode}
			items={jsonModes}
			placeholder="Mode"
		/>
	);
};

const MarkdownPanel: React.FC = () => {
	const explorer = useExplorer();
	return (
		<LabeledSelect
			id="markdownMode"
			label="Mode"
			value={explorer.markdownMode}
			onValueChange={explorer.setMarkdownMode}
			items={markdownModes}
			placeholder="Mode"
		/>
	);
};

const JavaScriptPanel = () => {
	const explorer = useExplorer();
	return (
		<>
			<LabeledSelect
				id="parser"
				label="Parser"
				value={explorer.parser}
				onValueChange={explorer.setParser}
				items={parsers}
				placeholder="Parser"
				isDisabled={true}
				icon={true}
			/>

			<LabeledSelect
				id="sourceType"
				label="Source Type"
				value={explorer.sourceType}
				onValueChange={explorer.setSourceType}
				items={sourceTypes}
				placeholder="Source Type"
			/>

			<LabeledSelect
				id="esVersion"
				label="ECMAScript Version"
				value={String(explorer.esVersion)}
				onValueChange={explorer.setEsVersion}
				items={versions}
				placeholder="ECMAScript Version"
			/>

			<div className="flex items-center gap-1.5">
				<Switch
					id="jsx"
					checked={explorer.isJSX}
					onCheckedChange={explorer.setIsJSX}
				/>
				<Label htmlFor="jsx">JSX</Label>
			</div>
		</>
	);
};

const Panel = ({ language }: { language: string }) => {
	switch (language) {
		case "json":
			return <JSONPanel />;
		case "markdown":
			return <MarkdownPanel />;
		default:
			return <JavaScriptPanel />;
	}
};

export const Options: FC = () => {
	const explorer = useExplorer();

	const currentLanguage = languages.find(
		language => language.value === explorer.language,
	);

	if (!currentLanguage) {
		return null;
	}

	const handleChangeLanguage = (value: string) => {
		explorer.setLanguage(value);

		if (value !== "javascript" && explorer.tool !== "ast") {
			explorer.setTool("ast");
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="flex items-center gap-1.5">
					<img
						src={currentLanguage.icon}
						alt={currentLanguage.label}
						width={16}
						height={16}
						className="w-4 h-4"
					/>
					<span>{currentLanguage.label}</span>
					<Settings className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="space-y-4 w-[372px]">
				<LabeledSelect
					id="language"
					label="Language"
					value={explorer.language}
					onValueChange={handleChangeLanguage}
					items={languages.map(language => ({
						value: language.value,
						label: language.label,
						icon: language.icon,
					}))}
					placeholder="Language"
					icon={true}
				/>
				<Panel language={explorer.language} />
			</PopoverContent>
		</Popover>
	);
};
