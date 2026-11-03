import { Group, Panel, Separator } from "react-resizable-panels";
import { ASTProvider } from "@/components/ast-provider";
import { CodeEditor } from "@/components/code-editor";
import { EsquerySelectorInput } from "@/components/esquery-selector-input";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToolSelector } from "@/components/tool-selector";
import { useExplorer } from "@/hooks/use-explorer";
import { tools } from "@/lib/tools";
import "./app.css";

function App() {
	const { tool } = useExplorer();

	const activeTool = tools.find(({ value }) => value === tool) ?? tools[0];
	return (
		<ThemeProvider>
			<div className="antialiased touch-manipulation font-sans">
				<div className="flex flex-col h-screen">
					<Navbar />
					<div className="h-full overflow-hidden">
						<div className="border-t h-full">
							<ASTProvider>
								<Group className="border-t h-full">
									<Panel
										defaultSize="50%"
										minSize="25%"
										role="region"
										aria-label="Code Editor Panel"
									>
										<EsquerySelectorInput />
										<CodeEditor />
									</Panel>
									<Separator className="w-2 bg-gutter dark:bg-gray-600 bg-gray-200 bg-no-repeat bg-center" />
									<Panel
										defaultSize="50%"
										minSize="25%"
										role="region"
										aria-label="Code Analysis Tools Panel"
									>
										<div className="bg-muted overflow-auto h-full relative flex flex-col">
											<div className="flex flex-col gap-2 p-4 z-10 sm:flex-row sm:flex-wrap sm:justify-between">
												<ToolSelector />
												<div className="flex flex-wrap items-center gap-1">
													{activeTool.options.map(
														(Option, index) => (
															<Option
																key={index}
															/>
														),
													)}
												</div>
											</div>
											<activeTool.component />
										</div>
									</Panel>
								</Group>
							</ASTProvider>
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
