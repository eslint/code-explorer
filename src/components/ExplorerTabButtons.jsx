/**
 * @fileoverview Tab buttons to select the type of explorer.
 * @author Yosuke Ota
 */
import React from "react";
import TabButtons from "./TabButtons.jsx";

/**
 * @type {import("./TabButtons.jsx").TabData[]}
 */
const EXPLORER_TABS = [
    { value: "ast", label: "AST" },
    { value: "scope", label: "Scope" },
    { value: "codePath", label: "Code Path" }
];

/**
 * Tab buttons to select the type of explorer.
 * @param {Object} params
 * @param {import("../utils/options").ExplorerOptions} params.options
 * @param {(newOptions: import("../utils/options").ExplorerOptions)=>void} params.onUpdateOptions
 * @returns {React.JSX.Element} React Component
 */
export default function ExplorerTabButtons({ options, onUpdateOptions }) {
    return <TabButtons
        tabs={EXPLORER_TABS}
        value={options.activeTab}
        onChange={value => onUpdateOptions({ activeTab: value })}
    />;
}
