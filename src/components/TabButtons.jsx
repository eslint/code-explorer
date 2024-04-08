import React from "react";
import "../scss/tab-buttons.scss";

export default function TabButtons({ tabs, name, value, onChange, className }) {
    return <div className={`tab-buttons ${className || ""}`}>
        {tabs.map(tab => {
            const active = value === tab.value;

            return (
                <label
                    className={
                        `c-btn c-btn--ghost tab-buttons__tab ${
                            active ? "tab-buttons__tab--active" : ""}`
                    }
                    key={tab.value}
                >
                    <input
                        type="radio"
                        name={name}
                        value={tab.value}
                        checked={active}
                        onChange={event => onChange(event.target.value)}
                    />
                    <span
                        className="tab-buttons__tab-content"
                    >
                        {tab.label}
                    </span>
                </label>
            );
        })}
    </div>;
}
