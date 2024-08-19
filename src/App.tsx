import "./App.css";
import { Navbar } from "./components/navbar";
import { useExplorer } from "./hooks/use-explorer";
import { tools } from "./lib/tools";
import { Editor } from "./components/editor";
import { ToolSelector } from "./components/tool-selector";
import { ThemeProvider } from "./components/theme-provider";

function App() {
	const { language, tool, jsCode, setJsCode, jsonCode, setJsonCode } =
		useExplorer();
	const activeTool = tools.find(({ value }) => value === tool) ?? tools[0];

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="antialiased touch-manipulation font-sans">
				<div className="flex flex-col h-screen">
					<Navbar />
					<div className="h-full overflow-hidden">
						<div className="grid sm:grid-cols-2 divide-x border-t h-full">
							<Editor
								className="h-[30dvh] sm:h-full"
								language={language}
								value={
									language === "javascript"
										? jsCode
										: jsonCode
								}
								onChange={value => {
									language === "javascript"
										? setJsCode(value ?? "")
										: setJsonCode(value ?? "");
								}}
							/>
							<div className="bg-foreground/5 pb-8 overflow-auto h-[70dvh] sm:h-full relative flex flex-col">
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
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
