/**
 * @fileoverview Tab buttons component.
 * @author Yosuke Ota
 */
import React from "react";
import TabButton from "./TabButton.jsx";
import "../scss/tab-buttons.scss";

/**
 * @typedef {Object} TabData
 * @property {string} label The label of the tab.
 * @property {string} value A value that identifies the tab.
 */
/**
 * Multiple tab buttons.
 * @param {Object} params Parameters
 * @param {TabData[]} params.tabs
 * @param {string} params.name The group name of the tab.
 * @param {string} params.value The value of the active tab.
 * @param {(value: string) => void} params.onChange The tab change event.
 * @param {boolean} params.outline Set to true to render outlines.
 * @returns {React.JSX.Element} React Component
 */
export default function TabButtons({ tabs, name, value, onChange, outline }) {
    const children = tabs.map(tab => {
        const active = value === tab.value;

        return (
            <TabButton
                key={tab.value}
                name={name}
                value={tab.value}
                active={active}
                onChange={onChange}>
                {tab.label}
            </TabButton>
        );
    })
    if (outline) {
        return (
            <div className="tab-buttons tab-buttons--with-outline">
                {children}
            </div>
        );
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment -- children has multiple elements.
    return <>{children}</>;
}
