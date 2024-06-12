/**
 * @fileoverview Tab button component.
 * @author Yosuke Ota
 */
import React from "react";
import "../scss/tab-button.scss";

/**
 * Tab button.
 * @param {Object} params Parameters
 * @param {string} params.name The group name of the tab.
 * @param {boolean} params.active Set active tab button to true.
 * @param {string} params.value A value that identifies the tab button.
 * @param {(value: string) => void} params.onChange The value change event.
 * @param {import("react").ReactNode[]} params.children Content of the tab button.
 * @returns {React.JSX.Element} React Component
 */
export default function TabButton({ name, children, active, value, onChange }) {
    return (
        <label
            className={
                `c-btn c-btn--ghost tab-button ${
                    active ? "tab-button--active" : ""}`
            }
            key={value}
        >
            <input
                type="radio"
                name={name}
                value={value}
                checked={active}
                onChange={event => onChange(event.target.value)}
            />
            <span
                className="tab-button__content"
            >
                {children}
            </span>
        </label>
    );
}
