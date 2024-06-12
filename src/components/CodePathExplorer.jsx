/**
 * @fileoverview CodePath Explorer component.
 * @author Yosuke Ota
 */
import React, { useMemo, useState } from "react";
import { Graphviz } from "@hpcc-js/wasm";
import { Linter } from "eslint";
import CodeMirror from "@uiw/react-codemirror";
import { bracketMatching } from "@codemirror/matchbrackets";
import "../scss/code-path-explorer.scss";
import TabButtons from "./TabButtons.jsx";
import ExplorerTabButtons from "./ExplorerTabButtons.jsx";
import { resolveLanguageOptions } from "../utils/options.js";
import { ExplorerOutputTheme } from "../utils/codemirror-output-theme.js";

const dotCodeMirrorExtensions = [
    bracketMatching(),
    ExplorerOutputTheme
];

/** @type {Graphviz|null} */
let initialGraphviz = null;

/**
 * Gets the string of the given node.
 * @param {ESTree.Node} node
 * @param {string|undefined} label
 */
function nodeToString(
    node,
    label
) {
    const event = label ? `:${label}` : "";

    switch (node.type) {
        case "Identifier":
            return `${node.type}${event} (${node.name})`;
        case "Literal":
            return `${node.type}${event} (${node.value})`;
        default:
            return `${(node).type}${event}`;
    }
}

class CodePathStack {

    /**
     * @param {Rule.CodePath} codePath
     * @param {CodePathStack|null} upper
     * @param {ESTree.Node} node
     */
    constructor(codePath, upper, node) {
        this.codePath = codePath;
        this.upper = upper;
        this.startNode = node;

        /**
         * @type {Map<Rule.CodePathSegment, CodePathSegmentInfo>}
         */
        this.currentSegments = new Map();

        /**
         * @type {Map<Rule.CodePathSegment, CodePathSegmentInfo>}
         */
        this.allSegments = new Map();
    }

    getSegment(segment) {
        return this.allSegments.get(segment);
    }

    getAllSegments() {
        return this.allSegments.values();
    }

    enterSegment(segment) {
        const info = {
            segment,
            nodes: []
        };

        this.currentSegments.set(segment, info);
        this.allSegments.set(segment, info);
    }

    exitSegment(segment) {
        this.currentSegments.delete(segment);
    }

    enterNode(node) {
        for (const codePathSegment of this.currentSegments.values()) {
            codePathSegment.nodes.push(nodeToString(node, "enter"));
        }
    }

    exitNode(node) {
        for (const codePathSegment of this.currentSegments.values()) {
            const last = codePathSegment.nodes.length - 1;

            if (
                last >= 0 &&
          codePathSegment.nodes[last] === nodeToString(node, "enter")
            ) {
                codePathSegment.nodes[last] = nodeToString(node, void 0);
            } else {
                codePathSegment.nodes.push(nodeToString(node, "exit"));
            }
        }
    }
}

/**
 * Makes a DOT code of a given code path.
 * The DOT code can be visualized with Graphvis.
 * @param {CodePath} codePath A code path to make DOT.
 * @returns {string} A DOT code of the code path.
 */
function makeDotArrows(codePath) {
    const stack = [
        { segment: codePath.initialSegment, index: 0 }
    ];
    const done = Object.create(null);
    let lastId = codePath.initialSegment.id;
    let text = `initial->${codePath.initialSegment.id}`;

    while (stack.length > 0) {
        const { segment, index } = stack.pop();

        if (done[segment.id] && index === 0) {
            continue;
        }
        done[segment.id] = segment;

        const nextSegment = (segment).allNextSegments[index];

        if (!nextSegment) {
            continue;
        }

        if (lastId === segment.id) {
            text += `->${nextSegment.id}`;
        } else {
            text += ` [color="#98A2B3"];\n    ${segment.id}->${nextSegment.id}`;
        }
        lastId = nextSegment.id;

        stack.unshift({ segment, index: 1 + index });
        stack.push({ segment: nextSegment, index: 0 });
    }

    codePath.returnedSegments.forEach(finalSegment => {
        if (lastId === finalSegment.id) {
            text += "->final";
        } else {
            text += ` [color="#98A2B3"];\n    ${finalSegment.id}->final`;
        }
        lastId = null;
    });

    codePath.thrownSegments.forEach(finalSegment => {
        if (lastId === finalSegment.id) {
            text += "->thrown";
        } else {
            text += ` [color="#98A2B3"];\n    ${finalSegment.id}->thrown`;
        }
        lastId = null;
    });

    return `${text} [color="#98A2B3"];`;
}

/**
 * Code Path Explorer component.
 * @param {Object} params
 * @param {string} params.codeValue
 * @param {import("../utils/options").ExplorerOptions} params.options
 * @param {(newOptions: import("../utils/options").ExplorerOptions)=>void} params.onUpdateOptions
 * @returns {JSX.Element} The Code Path Explorer component.
 */
export default function CodePathExplorer({ codeValue, options, onUpdateOptions }) {
    const [graphviz, setGraphviz] = useState(initialGraphviz);

    if (!graphviz) {

        // Load Graphviz if it is not already loaded.
        void Graphviz.load().then(result => {
            initialGraphviz = result;
            setGraphviz(initialGraphviz);
        });
        return (
            <CodePathExplorerBase
                options={options}
                onUpdateOptions={onUpdateOptions}>
                Loading...
            </CodePathExplorerBase>
        );
    }
    return (
        <CodePathExplorerWithGraphviz
            codeValue={codeValue}
            options={options}
            onUpdateOptions={onUpdateOptions}
            graphviz={graphviz}
        />
    );
}

function getAdjustedSelectedCodePathIndex(selectedCodePathIndex, numberOfCodePathList) {
    if (selectedCodePathIndex === 0) {
        return selectedCodePathIndex;
    }
    if (
        !selectedCodePathIndex ||
        selectedCodePathIndex < 0 ||
        selectedCodePathIndex >= numberOfCodePathList
    ) {
        return numberOfCodePathList - 1;
    }
    return selectedCodePathIndex;
}

/**
 * Code Path Explorer base component.
 * @param {Object} params
 * @param {import("../utils/options").ExplorerOptions} params.options
 * @param {(newOptions: import("../utils/options").ExplorerOptions)=>void} params.onUpdateOptions
 * @param {number} [params.numberOfCodePathList] Number of code paths
 * @param {JSX.Element} params.children
 * @returns {JSX.Element} The Code Path Explorer component.
 */
function CodePathExplorerBase({
    options, onUpdateOptions,
    children,
    numberOfCodePathList
}) {
    const codePathExplorerOptions = options.codePathExplorerOptions;
    const kind = codePathExplorerOptions.kind;

    const codePathSelectOptions = Array.from({ length: numberOfCodePathList }, (_, index) => ({
        value: index,
        label: `Code Path ${index + 1}`
    }));

    const selectedCodePathIndex = getAdjustedSelectedCodePathIndex(codePathExplorerOptions.selectedCodePathIndex, numberOfCodePathList);
    const updateSelectedCodePathIndex = value => {
        onUpdateOptions({
            codePathExplorerOptions: {
                ...codePathExplorerOptions,
                selectedCodePathIndex: value
            }
        });
    };

    return (
        <div
            className={`code-path-explorer code-path-explorer--${kind}`}
        >
            {/* The tool buttons of the Code Path Explorer. */}
            <div
                className="code-path-explorer__tools"
            >
                <div className="code-path-explorer__tools-left">
                    <ExplorerTabButtons
                        options={options}
                        onUpdateOptions={onUpdateOptions}
                    />
                </div>
                <div className="code-path-explorer__tools-right">
                    <TabButtons
                        outline
                        tabs={[
                            {
                                value: "dot",
                                label: (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.6666 12L14.6666 8L10.6666 4M5.33331 4L1.33331 8L5.33331 12" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>Code</span>
                                    </>
                                )
                            },
                            {
                                value: "graph",
                                label: (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_1356_777)">
                                                <path d="M7.99992 10.6667L10.6666 8.00004M10.6666 8.00004L7.99992 5.33337M10.6666 8.00004H5.33325M14.6666 8.00004C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00004C1.33325 4.31814 4.31802 1.33337 7.99992 1.33337C11.6818 1.33337 14.6666 4.31814 14.6666 8.00004Z" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1356_777">
                                                    <rect width="16" height="16" fill="transparent"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <span>Graph</span>
                                    </>

                                )
                            }
                        ]}
                        value={kind}
                        onChange={newValue => onUpdateOptions({
                            codePathExplorerOptions: {
                                ...codePathExplorerOptions,
                                kind: newValue
                            }
                        })}
                    />
                    {numberOfCodePathList
                        ? (
                            <div className="code-path-explorer__code-path-index-select">
                                <select
                                    className="c-custom-select"
                                    value={selectedCodePathIndex}
                                    onChange={event => updateSelectedCodePathIndex(event.target.value)}
                                >
                                    {codePathSelectOptions.map(({ value, label }) => (
                                        <option
                                            key={value}
                                            value={value}
                                        >
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                        : null
                    }
                </div>
            </div>
            {/* The part where the code path is displayed. */}
            <div
                className="code-path-explorer__main"
            >
                {children}
            </div>
        </div>
    );
}

/**
 * Code Path Explorer component with Graphviz instance.
 * @param {Object} params
 * @param {string} params.codeValue
 * @param {import("../utils/options").ExplorerOptions} params.options
 * @param {(newOptions: import("../utils/options").ExplorerOptions)=>void} params.onUpdateOptions
 * @param {Graphviz} params.graphviz
 * @returns {JSX.Element} The Code Path Explorer component.
 */
function CodePathExplorerWithGraphviz({
    codeValue,
    options, onUpdateOptions,
    graphviz
}) {
    const extracted = useMemo(() => {
        const linter = new Linter({ configType: "flat" });

        let stack = null;
        const allCodePaths = [];

        const config = {
            files: ["**/*.js", "*.js"],
            plugins: {
                "code-path": {
                    rules: {
                        "extract-code-path": {
                            create() {
                                return {
                                    onCodePathStart(codePath, node) {
                                        stack = new CodePathStack(codePath, stack, node);
                                        allCodePaths.push(stack);
                                    },
                                    onCodePathEnd() {
                                        stack = stack?.upper || null;
                                    },
                                    onCodePathSegmentStart(segment) {
                                        stack.enterSegment(segment);
                                    },
                                    onUnreachableCodePathSegmentStart(
                                        segment
                                    ) {
                                        stack.enterSegment(segment);
                                    },
                                    onCodePathSegmentEnd(segment) {
                                        stack.exitSegment(segment);
                                    },
                                    onUnreachableCodePathSegmentEnd(
                                        segment
                                    ) {
                                        stack.exitSegment(segment);
                                    },
                                    "*"(node) {
                                        if (!stack) {
                                            return;
                                        }
                                        stack.enterNode(node);
                                    },
                                    "*:exit"(node) {
                                        if (!stack) {
                                            return;
                                        }
                                        stack.exitNode(node);
                                    }
                                };
                            }
                        }
                    }
                }
            },
            rules: {
                "code-path/extract-code-path": "error"
            },
            languageOptions: resolveLanguageOptions(options.languageOptions)
        };

        try {
            const messages = linter.verify(codeValue, config, "a.js");

            if (allCodePaths.length === 0) {
                if (messages && messages.length > 0 && messages[0].fatal) {
                    return { error: messages[0].message };
                }
                return {
                    error: "Unknown error"
                };
            }
        } catch (error) {

            return {
                error: error.message
            };
        }

        return {
            codePathList: allCodePaths.map(target => {
                const { codePath } = target;

                let text =
                    "\n" +
                    "digraph {\n" +
                    "    bgcolor=\"transparent\";\n" +
                    "    node[shape=box,style=\"rounded,filled\",fillcolor=white,color=\"#E4E7EC\"];\n" +
                    "    initial[label=\"\",shape=circle,style=filled,fillcolor=\"#98A2B3\",color=\"#98A2B3\",width=0.25,height=0.25];\n";

                if (codePath.returnedSegments.length > 0) {
                    text += "    final[label=\"\",shape=doublecircle,style=filled,fillcolor=\"#98A2B3\",color=\"#98A2B3\",width=0.25,height=0.25];\n";
                }
                if (codePath.thrownSegments.length > 0) {
                    text +=
                        '    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];\n';
                }

                const arrows = makeDotArrows(codePath);

                for (const { segment, nodes } of target.getAllSegments()) {
                    text += `    ${segment.id}[`;

                    if (segment.reachable) {
                        text += 'label="';
                    } else {
                        text +=
                            'style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\\n';
                    }

                    if (nodes && nodes.length > 0) {
                        text += nodes.join("\\n");
                    } else {
                        text += "????";
                    }

                    text += '"];\n';
                }

                text += `    ${arrows}\n`;
                text += "}";
                return {
                    dot: text,
                    node: target.startNode
                };
            })
        };
    }, [codeValue, options.languageOptions]);

    if (extracted.error) {
        // If an error occurs, an error message will be displayed.
        return (
            <CodePathExplorerBase
                options={options}
                onUpdateOptions={onUpdateOptions}
            >
                {extracted.error}
            </CodePathExplorerBase>
        );
    }

    const codePathExplorerOptions = options.codePathExplorerOptions;
    const selectedCodePathIndex = getAdjustedSelectedCodePathIndex(codePathExplorerOptions.selectedCodePathIndex, extracted.codePathList.length);

    const dot = extracted.codePathList[selectedCodePathIndex].dot;

    // Renders the code path information.
    return (
        <CodePathExplorerBase
            options={options}
            onUpdateOptions={onUpdateOptions}
            numberOfCodePathList={extracted.codePathList.length}
        >
            {
                codePathExplorerOptions.kind === "dot"
                    ? <CodeMirror
                        value={dot.trim()}
                        minWidth="100%"
                        height="100%"
                        extensions={
                            dotCodeMirrorExtensions
                        }
                        editable={false}
                    />
                    : <div
                        className="code-path-explorer__graph"
                        dangerouslySetInnerHTML={{ __html: graphviz.dot(dot) }}
                    />
            }
        </CodePathExplorerBase>
    );
}
