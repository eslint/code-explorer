import "regenerator-runtime/runtime";

import React, { useState, useMemo, useCallback } from "react";
import CodeEditor from "./components/CodeEditor";
import CodePathExplorer from "./components/CodePathExplorer";
import Unicode from "./utils/unicode";
import debounce from "./utils/debounce";
import "./scss/explorer.scss";
import "./scss/header.scss";
import { getDefaultOptions, normalizeOptions } from "./utils/options.js";
import ExplorerTabButtons from "./components/ExplorerTabButtons.jsx";

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
                            <svg className="code-explorer-logo" width="131" height="19" viewBox="0 0 131 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.64 15.28C3.93333 15.28 2.57333 14.8 1.56 13.84C0.546667 12.8667 0.04 11.4733 0.04 9.66V6.34C0.04 4.52667 0.546667 3.14 1.56 2.18C2.57333 1.20667 3.93333 0.719999 5.64 0.719999C7.34667 0.719999 8.66 1.18667 9.58 2.12C10.5133 3.05333 10.98 4.33333 10.98 5.96V6.08H8.62V5.9C8.62 5.02 8.37333 4.3 7.88 3.74C7.4 3.16667 6.65333 2.88 5.64 2.88C4.65333 2.88 3.87333 3.18667 3.3 3.8C2.74 4.4 2.46 5.23333 2.46 6.3V9.7C2.46 10.7533 2.74 11.5867 3.3 12.2C3.87333 12.8133 4.65333 13.12 5.64 13.12C6.65333 13.12 7.4 12.84 7.88 12.28C8.37333 11.7067 8.62 10.98 8.62 10.1V9.76H10.98V10.04C10.98 11.6667 10.5133 12.9467 9.58 13.88C8.66 14.8133 7.34667 15.28 5.64 15.28ZM17.7916 15.28C16.8049 15.28 15.9182 15.08 15.1316 14.68C14.3582 14.2667 13.7449 13.6867 13.2916 12.94C12.8516 12.18 12.6316 11.2733 12.6316 10.22V9.9C12.6316 8.84667 12.8516 7.94 13.2916 7.18C13.7449 6.42 14.3582 5.84 15.1316 5.44C15.9182 5.04 16.8049 4.84 17.7916 4.84C18.7782 4.84 19.6582 5.04 20.4316 5.44C21.2049 5.84 21.8116 6.42 22.2516 7.18C22.7049 7.94 22.9316 8.84667 22.9316 9.9V10.22C22.9316 11.2733 22.7049 12.18 22.2516 12.94C21.8116 13.6867 21.2049 14.2667 20.4316 14.68C19.6582 15.08 18.7782 15.28 17.7916 15.28ZM17.7916 13.24C18.6316 13.24 19.3182 12.9733 19.8516 12.44C20.3849 11.8933 20.6516 11.1333 20.6516 10.16V9.96C20.6516 8.98667 20.3849 8.23333 19.8516 7.7C19.3182 7.15333 18.6316 6.88 17.7916 6.88C16.9516 6.88 16.2649 7.15333 15.7316 7.7C15.1982 8.23333 14.9316 8.98667 14.9316 9.96V10.16C14.9316 11.1333 15.1982 11.8933 15.7316 12.44C16.2649 12.9733 16.9516 13.24 17.7916 13.24ZM29.2172 15.28C28.4172 15.28 27.6705 15.0867 26.9772 14.7C26.2839 14.3 25.7305 13.72 25.3172 12.96C24.9039 12.2 24.6972 11.2867 24.6972 10.22V9.9C24.6972 8.83333 24.9039 7.92 25.3172 7.16C25.7305 6.4 26.2772 5.82667 26.9572 5.44C27.6505 5.04 28.4039 4.84 29.2172 4.84C29.8305 4.84 30.3505 4.91333 30.7772 5.06C31.2039 5.20667 31.5439 5.39333 31.7972 5.62C32.0639 5.84667 32.2705 6.09333 32.4172 6.36H32.7572V0.999999H35.0372V15H32.7972V13.7H32.4572C32.2172 14.1 31.8505 14.4667 31.3572 14.8C30.8639 15.12 30.1505 15.28 29.2172 15.28ZM29.8972 13.28C30.7239 13.28 31.4105 13.0133 31.9572 12.48C32.5039 11.9333 32.7772 11.16 32.7772 10.16V9.96C32.7772 8.94667 32.5039 8.17333 31.9572 7.64C31.4239 7.10667 30.7372 6.84 29.8972 6.84C29.0705 6.84 28.3772 7.10667 27.8172 7.64C27.2705 8.17333 26.9972 8.94667 26.9972 9.96V10.16C26.9972 11.16 27.2705 11.9333 27.8172 12.48C28.3772 13.0133 29.0705 13.28 29.8972 13.28ZM42.2706 15.28C41.284 15.28 40.4106 15.0733 39.6506 14.66C38.904 14.2333 38.3173 13.64 37.8906 12.88C37.4773 12.1067 37.2706 11.2067 37.2706 10.18V9.94C37.2706 8.9 37.4773 8 37.8906 7.24C38.304 6.48 38.884 5.89333 39.6306 5.48C40.3773 5.05333 41.2373 4.84 42.2106 4.84C43.1706 4.84 44.0106 5.05333 44.7306 5.48C45.4506 5.89333 46.0106 6.48 46.4106 7.24C46.8106 8 47.0106 8.88667 47.0106 9.9V10.72H39.5906C39.6173 11.4933 39.8906 12.1133 40.4106 12.58C40.9306 13.0467 41.5706 13.28 42.3306 13.28C43.0773 13.28 43.6306 13.12 43.9906 12.8C44.3506 12.4667 44.624 12.0933 44.8106 11.68L46.7106 12.66C46.524 13.02 46.2506 13.4067 45.8906 13.82C45.544 14.22 45.0773 14.5667 44.4906 14.86C43.904 15.14 43.164 15.28 42.2706 15.28ZM39.6106 8.98H44.6706C44.6173 8.32667 44.364 7.80667 43.9106 7.42C43.4706 7.03333 42.8973 6.84 42.1906 6.84C41.4573 6.84 40.8706 7.03333 40.4306 7.42C39.9906 7.80667 39.7173 8.32667 39.6106 8.98ZM53.9894 15V0.999999H62.9094V3.18H56.4094V6.86H62.3494V9.04H56.4094V12.82H63.0094V15H53.9894ZM64.1227 15L67.8027 10.02L64.1827 5.12H66.8627L69.2827 8.54H69.6227L72.0427 5.12H74.7027L71.0827 10.02L74.7627 15H72.0627L69.6227 11.52H69.2827L66.8427 15H64.1227ZM76.6186 19V5.12H78.8786V6.42H79.2186C79.4453 6.00667 79.8053 5.64 80.2986 5.32C80.8053 5 81.5253 4.84 82.4586 4.84C83.2586 4.84 83.9986 5.04 84.6786 5.44C85.3719 5.82667 85.9253 6.4 86.3386 7.16C86.7519 7.92 86.9586 8.83333 86.9586 9.9V10.22C86.9586 11.2867 86.7519 12.2 86.3386 12.96C85.9253 13.72 85.3786 14.3 84.6986 14.7C84.0186 15.0867 83.2719 15.28 82.4586 15.28C81.8319 15.28 81.3053 15.2067 80.8786 15.06C80.4653 14.9133 80.1253 14.72 79.8586 14.48C79.6053 14.24 79.4053 14 79.2586 13.76H78.9186V19H76.6186ZM81.7786 13.28C82.6186 13.28 83.3053 13.0133 83.8386 12.48C84.3853 11.9333 84.6586 11.16 84.6586 10.16V9.96C84.6586 8.94667 84.3853 8.17333 83.8386 7.64C83.2919 7.10667 82.6053 6.84 81.7786 6.84C80.9519 6.84 80.2586 7.10667 79.6986 7.64C79.1519 8.17333 78.8786 8.94667 78.8786 9.96V10.16C78.8786 11.16 79.1519 11.9333 79.6986 12.48C80.2586 13.0133 80.9519 13.28 81.7786 13.28ZM89.192 15V0.999999H91.492V15H89.192ZM98.8869 15.28C97.9002 15.28 97.0135 15.08 96.2269 14.68C95.4535 14.2667 94.8402 13.6867 94.3869 12.94C93.9469 12.18 93.7269 11.2733 93.7269 10.22V9.9C93.7269 8.84667 93.9469 7.94 94.3869 7.18C94.8402 6.42 95.4535 5.84 96.2269 5.44C97.0135 5.04 97.9002 4.84 98.8869 4.84C99.8735 4.84 100.754 5.04 101.527 5.44C102.3 5.84 102.907 6.42 103.347 7.18C103.8 7.94 104.027 8.84667 104.027 9.9V10.22C104.027 11.2733 103.8 12.18 103.347 12.94C102.907 13.6867 102.3 14.2667 101.527 14.68C100.754 15.08 99.8735 15.28 98.8869 15.28ZM98.8869 13.24C99.7269 13.24 100.414 12.9733 100.947 12.44C101.48 11.8933 101.747 11.1333 101.747 10.16V9.96C101.747 8.98667 101.48 8.23333 100.947 7.7C100.414 7.15333 99.7269 6.88 98.8869 6.88C98.0469 6.88 97.3602 7.15333 96.8269 7.7C96.2935 8.23333 96.0269 8.98667 96.0269 9.96V10.16C96.0269 11.1333 96.2935 11.8933 96.8269 12.44C97.3602 12.9733 98.0469 13.24 98.8869 13.24ZM106.273 15V5.12H108.533V6.26H108.873C109.019 5.84667 109.266 5.54667 109.613 5.36C109.959 5.17333 110.373 5.08 110.853 5.08H112.053V7.12H110.813C110.146 7.12 109.606 7.3 109.193 7.66C108.779 8.00667 108.573 8.54667 108.573 9.28V15H106.273ZM118.053 15.28C117.067 15.28 116.193 15.0733 115.433 14.66C114.687 14.2333 114.1 13.64 113.673 12.88C113.26 12.1067 113.053 11.2067 113.053 10.18V9.94C113.053 8.9 113.26 8 113.673 7.24C114.087 6.48 114.667 5.89333 115.413 5.48C116.16 5.05333 117.02 4.84 117.993 4.84C118.953 4.84 119.793 5.05333 120.513 5.48C121.233 5.89333 121.793 6.48 122.193 7.24C122.593 8 122.793 8.88667 122.793 9.9V10.72H115.373C115.4 11.4933 115.673 12.1133 116.193 12.58C116.713 13.0467 117.353 13.28 118.113 13.28C118.86 13.28 119.413 13.12 119.773 12.8C120.133 12.4667 120.407 12.0933 120.593 11.68L122.493 12.66C122.307 13.02 122.033 13.4067 121.673 13.82C121.327 14.22 120.86 14.5667 120.273 14.86C119.687 15.14 118.947 15.28 118.053 15.28ZM115.393 8.98H120.453C120.4 8.32667 120.147 7.80667 119.693 7.42C119.253 7.03333 118.68 6.84 117.973 6.84C117.24 6.84 116.653 7.03333 116.213 7.42C115.773 7.80667 115.5 8.32667 115.393 8.98ZM124.955 15V5.12H127.215V6.26H127.555C127.701 5.84667 127.948 5.54667 128.295 5.36C128.641 5.17333 129.055 5.08 129.535 5.08H130.735V7.12H129.495C128.828 7.12 128.288 7.3 127.875 7.66C127.461 8.00667 127.255 8.54667 127.255 9.28V15H124.955Z" fill="#98A2B3"/>
                            </svg>
                        </div>
                    </a>
                    <nav className="site-nav" aria-label="Main">
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
