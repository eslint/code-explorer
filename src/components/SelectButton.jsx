/**
 * @fileoverview Select button component.
 * @author Yosuke Ota
 */
import React from "react";
import "../scss/select-button.scss";

/**
 * Select button.
 * This button works like a checkbox, allowing you to toggle the selected state between ON / OFF.
 * @param {Object} params Parameters
 * @param {boolean} params.selected Set to true if selected.
 * @param {(value: boolean) => void} params.onChange The value change event.
 * @param {import("react").ReactNode[]} params.children Content of the select button.
 * @returns {React.JSX.Element} React Component
 */
export default function SelectButton({ children, selected, onChange }) {
    return (
        <label
            className={
                `c-btn c-btn--ghost select-button ${
                    selected ? "select-button--selected" : ""
                }`
            }
        >
            <input
                type="checkbox"
                checked={selected}
                onChange={event => onChange(event.target.checked)}
            />
            <span
                className="select-button__content"
            >
                {children}
            </span>
        </label>
    );
}
