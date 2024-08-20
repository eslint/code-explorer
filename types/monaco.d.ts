import * as monacoEditor from "monaco-editor";

declare global {
	interface Window {
		monaco: typeof monacoEditor;
	}
}
