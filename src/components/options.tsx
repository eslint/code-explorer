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
import type {
	JsonMode,
	Language,
	MarkdownMode,
	SourceType,
	Version,
} from "@/hooks/use-explorer";

const JSONPanel: React.FC = () => {
	const explorer = useExplorer();
	const { jsonOptions, setJsonOptions } = explorer;
	const { jsonMode } = jsonOptions;
	return (
		<LabeledSelect
			id="jsonMode"
			label="Mode"
			value={jsonMode}
			onValueChange={(value: string) => {
				const jsonMode = value as JsonMode;
				setJsonOptions({ ...jsonOptions, jsonMode });
			}}
			items={jsonModes}
			placeholder="Mode"
		/>
	);
};

const MarkdownPanel: React.FC = () => {
	const explorer = useExplorer();
	const { markdownOptions, setMarkdownOptions } = explorer;
	const { markdownMode } = markdownOptions;
	return (
		<LabeledSelect
			id="markdownMode"
			label="Mode"
			value={markdownMode}
			onValueChange={(value: string) => {
				const markdownMode = value as MarkdownMode;
				setMarkdownOptions({ ...markdownOptions, markdownMode });
			}}
			items={markdownModes}
			placeholder="Mode"
		/>
	);
};

const CssPanel: React.FC = () => {
	const explorer = useExplorer();
	const { cssOptions, setCssOptions } = explorer;
	const { tolerant } = cssOptions;
	return (
		<div className="flex items-center gap-1.5">
			<Switch
				id="tolerant"
				checked={tolerant}
				onCheckedChange={(value: boolean) => {
					setCssOptions({ ...cssOptions, tolerant: value });
				}}
			/>
			<Label htmlFor="tolerant">Tolerant Parsing</Label>
		</div>
	);
};

const JavaScriptPanel = () => {
	const explorer = useExplorer();
	const { jsOptions, setJsOptions } = explorer;
	const { parser, sourceType, esVersion, isJSX } = jsOptions;
	return (
		<>
			<LabeledSelect
				id="parser"
				label="Parser"
				value={parser}
				onValueChange={(parser: string) => {
					setJsOptions({ ...jsOptions, parser });
				}}
				items={parsers}
				placeholder="Parser"
				isDisabled={true}
				icon={true}
			/>

			<LabeledSelect
				id="sourceType"
				label="Source Type"
				value={sourceType}
				onValueChange={(value: string) => {
					const sourceType = value as SourceType;
					setJsOptions({ ...jsOptions, sourceType });
				}}
				items={sourceTypes}
				placeholder="Source Type"
			/>

			<LabeledSelect
				id="esVersion"
				label="ECMAScript Version"
				value={esVersion as string}
				onValueChange={(value: string) => {
					const esVersion = value as Version;
					setJsOptions({ ...jsOptions, esVersion });
				}}
				items={versions}
				placeholder="ECMAScript Version"
			/>

			<div className="flex items-center gap-1.5">
				<Switch
					id="jsx"
					checked={isJSX}
					onCheckedChange={(value: boolean) => {
						setJsOptions({ ...jsOptions, isJSX: value });
					}}
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
		case "css":
			return <CssPanel />;
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
		const language = value as Language;
		explorer.setLanguage(language);

		if (language !== "javascript" && explorer.tool !== "ast") {
			explorer.setTool("ast");
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					aria-label="Language Options"
					variant="outline"
					className="flex items-center gap-1.5"
				>
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
