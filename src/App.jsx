/**
 * @fileoverview App component
 * @author Yosuke Ota
 */
import "regenerator-runtime/runtime";

import React, { useState, useMemo, useCallback } from "react";
import CodeEditor from "./components/CodeEditor.jsx";
import CodePathExplorer from "./components/CodePathExplorer.jsx";
import Unicode from "./utils/unicode.js";
import debounce from "./utils/debounce.js";
import "./scss/explorer.scss";
import "./scss/header.scss";
import "./scss/fonts.scss";
import { getDefaultOptions, normalizeOptions } from "./utils/options.js";
import ExplorerTabButtons from "./components/ExplorerTabButtons.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";

/**
 * @typedef {import("./utils/options.js").ExplorerOptions} ExplorerOptions
 */

const DEFAULT_TEXT = "const a = 'b';";

const getUrlState = () => {
    try {
        const urlState = JSON.parse(Unicode.decodeFromBase64(window.location.hash.replace(/^#/u, "")));

        if (typeof urlState.text === "undefined") {
            return null;
        }

        return { text: urlState.text, options: urlState.options };
    } catch {
        return null;
    }
};

const getLocalStorageState = () => {
    try {
        const localStorageState = JSON.parse(window.localStorage.getItem("linterExplorerState") || "{}");

        if (typeof localStorageState.text === "undefined") {
            return null;
        }

        return { text: localStorageState.text, options: localStorageState.options };
    } catch {
        return null;
    }
};

const hasLocalStorage = () => {
    try {
        window.localStorage.setItem("localStorageTest", "foo");
        window.localStorage.removeItem("localStorageTest");
        return true;
    } catch {
        return false;
    }
};

const App = () => {

    /** @type {string} */
    let initialText,

        /** @type {ExplorerOptions} */
        initialOptions;

    const initialState = getUrlState() || getLocalStorageState();

    if (initialState) {
        initialText = initialState.text;
        initialOptions = initialState.options;
    } else {
        initialText = DEFAULT_TEXT;
        initialOptions = getDefaultOptions();
    }

    const [text, setText] = useState(initialText);
    const [options, setOptions] = useState(initialOptions);

    const normalizedOption = normalizeOptions(options);

    const storeState = useCallback(({ newText, newOptions }) => {
        const serializedState = JSON.stringify({ text: newText || text, options: newOptions || options });

        if (hasLocalStorage()) {
            window.localStorage.setItem("linterExplorerState", serializedState);
        }

        const url = new URL(location);

        url.hash = Unicode.encodeToBase64(serializedState);
        history.replaceState(null, null, url);
    }, [options, text]);

    const debouncedOnUpdate = useMemo(() => debounce(value => {
        setText(value);
        storeState({ newText: value });
    }, 400), [storeState]);

    const updateOptions = newOptions => {
        setOptions(newOptions);
        storeState({ newOptions });
    };

    return (
        <div className="explorer-wrapper">
            <header className="site-header">
                <div className="content-container">
                    <a href="/" aria-label="Homepage" className="logo-link">
                        <div className="logo">
                            <style>
                                {`[data-theme="dark"] .logo-component {
                                    fill: #fff;
                                }

                                [data-theme="dark"] #logo-center {
                                    opacity: 60%;
                                }`}
                            </style>
                            <svg className="brand-logo" width="203" height="58" viewBox="0 0 203 58" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ESLint logo">
                                <path d="M46.5572 21.1093L34.0167 13.8691C33.7029 13.6879 33.3161 13.6879 33.0023 13.8691L20.4616 21.1093C20.148 21.2905 19.9543 21.6253 19.9543 21.9878V36.4681C19.9543 36.8304 20.148 37.1654 20.4616 37.347L33.0023 44.5871C33.3161 44.7684 33.7029 44.7684 34.0167 44.5871L46.5572 37.347C46.871 37.1657 47.0644 36.8306 47.0644 36.4681V21.9878C47.0641 21.6253 46.8707 21.2905 46.5572 21.1093Z" fill="#8080F2" id="logo-center" className="logo-component"></path>
                                <path d="M0.904381 27.7046L15.8878 1.63772C16.4321 0.695223 17.4375 0 18.5258 0H48.4931C49.5817 0 50.5873 0.695223 51.1316 1.63772L66.115 27.6471C66.6593 28.5899 66.6593 29.7796 66.115 30.7224L51.1316 56.5756C50.5873 57.5181 49.5817 58 48.4931 58H18.526C17.4377 58 16.4321 57.5326 15.8881 56.5899L0.90464 30.6944C0.359854 29.7522 0.359854 28.6471 0.904381 27.7046ZM13.3115 40.2393C13.3115 40.6225 13.5422 40.977 13.8744 41.1689L32.96 52.1803C33.2919 52.3719 33.7078 52.3719 34.0397 52.1803L53.1401 41.1689C53.4721 40.977 53.7043 40.6228 53.7043 40.2393V18.2161C53.7043 17.8327 53.4754 17.4785 53.1432 17.2866L34.0584 6.27513C33.7264 6.08327 33.3111 6.08327 32.9792 6.27513L13.8775 17.2866C13.5453 17.4785 13.3115 17.8327 13.3115 18.2161V40.2393V40.2393Z" fill="#4B32C3" className="logo-component"></path>
                                <path d="M86.6971 43.7102V14.2899H105.442V18.871H91.7826V26.6044H104.265V31.1855H91.7826V39.129H105.652V43.7102H86.6971Z" fill="#101828" className= "logo-component"></path>
                                <path d="M118.919 44.2986C116.678 44.2986 114.688 43.9063 112.951 43.1218C111.242 42.3092 109.897 41.1464 108.916 39.6334C107.936 38.1203 107.445 36.271 107.445 34.0855V32.9928H112.447V34.0855C112.447 36.0189 113.035 37.4619 114.212 38.4145C115.389 39.3672 116.958 39.8435 118.919 39.8435C120.909 39.8435 122.408 39.4372 123.416 38.6247C124.425 37.8121 124.929 36.7614 124.929 35.4725C124.929 34.6039 124.691 33.9034 124.215 33.371C123.739 32.8107 123.038 32.3623 122.113 32.0261C121.217 31.6899 120.124 31.3677 118.835 31.0594L117.574 30.8073C115.641 30.359 113.96 29.7986 112.531 29.1261C111.13 28.4256 110.051 27.529 109.295 26.4363C108.538 25.3435 108.16 23.9145 108.16 22.1493C108.16 20.3841 108.58 18.871 109.421 17.6102C110.261 16.3493 111.452 15.3826 112.993 14.7102C114.534 14.0377 116.341 13.7015 118.415 13.7015C120.488 13.7015 122.338 14.0517 123.963 14.7522C125.588 15.4527 126.863 16.5034 127.787 17.9044C128.74 19.3053 129.216 21.0566 129.216 23.158V24.545H124.215V23.158C124.215 21.9532 123.977 20.9865 123.5 20.258C123.024 19.5295 122.352 18.9971 121.483 18.6609C120.614 18.3247 119.592 18.1566 118.415 18.1566C116.678 18.1566 115.361 18.4928 114.464 19.1652C113.568 19.8377 113.119 20.7904 113.119 22.0232C113.119 22.8078 113.315 23.4802 113.708 24.0406C114.128 24.573 114.73 25.0213 115.515 25.3855C116.327 25.7218 117.336 26.016 118.541 26.2681L119.802 26.5623C121.819 27.0107 123.584 27.5851 125.098 28.2855C126.611 28.958 127.787 29.8546 128.628 30.9754C129.497 32.0962 129.931 33.5532 129.931 35.3464C129.931 37.1116 129.469 38.6667 128.544 40.0116C127.647 41.3566 126.372 42.4073 124.719 43.1638C123.094 43.9203 121.161 44.2986 118.919 44.2986Z" fill="#101828" className= "logo-component"></path>
                                <path d="M133.1 43.7102V14.2899H138.185V39.129H151.971V43.7102H133.1Z" fill="#101828" className="logo-component"></path>
                                <path d="M154.827 43.7102V22.9479H159.661V43.7102H154.827ZM157.223 20.3C156.354 20.3 155.598 20.0198 154.954 19.4595C154.337 18.871 154.029 18.1005 154.029 17.1479C154.029 16.1952 154.337 15.4387 154.954 14.8783C155.598 14.2899 156.354 13.9957 157.223 13.9957C158.148 13.9957 158.904 14.2899 159.493 14.8783C160.109 15.4387 160.417 16.1952 160.417 17.1479C160.417 18.1005 160.109 18.871 159.493 19.4595C158.904 20.0198 158.148 20.3 157.223 20.3Z" fill="#101828" className= "logo-component"></path>
                                <path d="M164.525 43.7102V22.9479H169.275V25.8479H169.989C170.353 25.0633 171.012 24.3208 171.964 23.6203C172.917 22.9198 174.36 22.5696 176.293 22.5696C177.891 22.5696 179.305 22.9338 180.538 23.6623C181.771 24.3909 182.724 25.3995 183.396 26.6884C184.097 27.9773 184.447 29.5044 184.447 31.2696V43.7102H179.614V31.6479C179.614 29.9667 179.193 28.7198 178.353 27.9073C177.54 27.0667 176.377 26.6464 174.864 26.6464C173.155 26.6464 171.81 27.2208 170.83 28.3696C169.849 29.4904 169.359 31.1015 169.359 33.2029V43.7102H164.525Z" fill="#101828" className= "logo-component"></path>
                                <path d="M196.449 43.7102C195.104 43.7102 194.025 43.3179 193.213 42.5334C192.428 41.7208 192.036 40.6281 192.036 39.2551V26.9406H186.614V22.9479H192.036V16.2652H196.869V22.9479H202.837V26.9406H196.869V38.4566C196.869 39.2971 197.262 39.7174 198.046 39.7174H202.207V43.7102H196.449Z" fill="#101828" className= "logo-component"></path>
                            </svg>
                        </div>
                        <span className="code-explorer-logo">Code Explorer</span>
                    </a>
                    <nav className="site-nav" aria-label="Main">
                        <ThemeSwitcher />
                        <div className="flexer">
                            <a href="https://eslint.org/docs/latest/use/getting-started" className="c-btn c-btn--primary">Get started</a>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="explorer__main" id="main" >
                <div className="explorer__editor" aria-label="Editor">
                    <CodeEditor
                        tabIndex="0"
                        codeValue={text}
                        onUpdate={debouncedOnUpdate}
                    />
                </div>
                <div className="explorer__viewer" aria-label="Explorer">
                    {
                        options.activeTab === "codePath"
                            ? <CodePathExplorer
                                codeValue={text}
                                options={normalizedOption}
                                onUpdateOptions={newOptions => updateOptions({ ...options, ...newOptions })}
                            />
                            : <ExplorerTabButtons
                                options={normalizedOption}
                                onUpdateOptions={newOptions => updateOptions({ ...options, ...newOptions })}
                            />
                    }
                </div>
            </main>
        </div>
    );
};

export default App;
