import "./App.css";
import { Navbar } from "./components/navbar";
import { useExplorer } from "./hooks/use-explorer";
import { tools } from "./lib/tools";
import { Editor } from "./components/editor";
import { EsquerySelectorInput } from "./components/esquery-selector-input";
import { ToolSelector } from "./components/tool-selector";
import { ThemeProvider } from "./components/theme-provider";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useAST } from "@/hooks/use-ast";
import { convertNodesToRanges } from "@/lib/convert-nodes-to-ranges";

function App() {
	const { language, tool, code, setCode } = useExplorer();

	const astParseResult = useAST();

	const activeTool = tools.find(({ value }) => value === tool) ?? tools[0];
	return (
		<ThemeProvider>
			<div className="antialiased touch-manipulation font-sans">
				<div className="flex flex-col h-screen">
					<Navbar />
					<div className="h-full overflow-hidden">
						<div className="border-t h-full">
							<PanelGroup
								direction="horizontal"
								className="border-t h-full"
							>
								<Panel
									defaultSize={50}
									minSize={25}
									role="region"
									aria-label="Code Editor Panel"
								>
									<EsquerySelectorInput />
									<Editor
										value={code[language]}
										highlightedRanges={
											astParseResult.ok
												? convertNodesToRanges(
														astParseResult.esqueryMatchedNodes,
													)
												: undefined
										}
										onChange={value => {
											setCode({
												...code,
												[language]: value,
											});
										}}
									/>
								</Panel>
								<PanelResizeHandle className="w-2 bg-gutter dark:bg-gray-600 bg-gray-200 bg-no-repeat bg-center" />
								<Panel
									defaultSize={50}
									minSize={25}
									role="region"
									aria-label="Code Analysis Tools Panel"
								>
									<div className="bg-muted overflow-auto h-[70dvh] sm:h-full relative flex flex-col">
										<div className="flex sm:items-center flex-col sm:flex-row justify-between p-4 gap-2 z-10">
											<ToolSelector />
											<div className="flex items-center gap-1">
												{activeTool.options.map(
													(Option, index) => (
														<Option key={index} />
													),
												)}
											</div>
										</div>
										<activeTool.component />
									</div>
								</Panel>
							</PanelGroup>
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
