import "./App.css";
import { Navbar } from "./components/navbar";
import { useExplorer } from "./hooks/use-explorer";
import { tools } from "./lib/tools";
import { Editor } from "./components/editor";
import { ToolSelector } from "./components/tool-selector";
import { ThemeProvider } from "./components/theme-provider";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function App() {
	const {
		language,
		tool,
		jsCode,
		setJsCode,
		jsonCode,
		setJsonCode,
		markdownCode,
		setMarkdownCode,
	} = useExplorer();
	const activeTool = tools.find(({ value }) => value === tool) ?? tools[0];

	let editorValue;
	switch (language) {
		case "javascript":
			editorValue = jsCode;
			break;
		case "json":
			editorValue = jsonCode;
			break;
		case "markdown":
			editorValue = markdownCode;
			break;
		default:
			editorValue = "";
	}

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="antialiased touch-manipulation font-sans">
				<div className="flex flex-col h-screen">
					<Navbar />
					<div className="h-full overflow-hidden">
						<PanelGroup
							direction="horizontal"
							className="border-t h-full"
						>
							<Panel defaultSize={50} minSize={25}>
								<Editor
									value={editorValue}
									onChange={value => {
										switch (language) {
											case "javascript":
												setJsCode(value);
												break;
											case "json":
												setJsonCode(value);
												break;
											case "markdown":
												setMarkdownCode(value);
												break;
										}
									}}
								/>
							</Panel>
							<PanelResizeHandle className="w-2 bg-gutter dark:bg-gray-900 bg-gray-100 bg-no-repeat bg-center" />
							<Panel defaultSize={50} minSize={25}>
								<div className="bg-foreground/5 overflow-auto h-[70dvh] sm:h-full relative flex flex-col">
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
		</ThemeProvider>
	);
}

export default App;
