/**
 * @fileoverview This is the first JavaScript called by the application.
 * @author Yosuke Ota
 */
import "./scss/components/buttons.scss";
import "./scss/components/theme-switcher.scss";
import "./scss/tokens/themes.scss";
import "./scss/tokens/spacing.scss";
import "./scss/tokens/typography.scss";
import "./scss/tokens/ui.scss";
import "./scss/foundations.scss";
import "./scss/forms.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const container = document.getElementById("explorer-app");
const root = createRoot(container);

root.render(<React.StrictMode><App /></React.StrictMode>);
