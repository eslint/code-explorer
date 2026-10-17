import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { ASTProvider } from "./hooks/use-ast";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLDivElement,
);
root.render(
	<React.StrictMode>
		<ASTProvider>
			<App />
		</ASTProvider>
	</React.StrictMode>,
);
