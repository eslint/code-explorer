import React from "react";
import "../scss/tab-buttons.scss";
import TabButtons from "./TabButtons.jsx";

const EXPLORER_TABS = [
    { value: "ast", label: "AST" },
    { value: "scope", label: "Scope" },
    { value: "codePath", label: "Code Path" }
];

/**
 * Tab button to select the type of explorer.
 * @param {Object} params
 * @param {import("../utils/options").ExplorerOptions} params.options
 * @param {(newOptions: import("../utils/options").ExplorerOptions)=>void} params.onUpdateOptions
 * @returns {JSX.Element} The Code Path Explorer component.
 */
export default function ExplorerTabButtons({ options, onUpdateOptions }) {
    return <TabButtons
        tabs={EXPLORER_TABS}
        value={options.activeTab}
        onChange={value => onUpdateOptions({ activeTab: value })}
    />;
}
