import React, { useMemo, useState } from "react";
import { Graphviz } from "@hpcc-js/wasm";
import { Linter } from "eslint";
import "../scss/code-path-explorer.scss";
import TabButtons from "./TabButtons";

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
            text += `;\n    ${segment.id}->${nextSegment.id}`;
        }
        lastId = nextSegment.id;

        stack.unshift({ segment, index: 1 + index });
        stack.push({ segment: nextSegment, index: 0 });
    }

    codePath.returnedSegments.forEach(finalSegment => {
        if (lastId === finalSegment.id) {
            text += "->final";
        } else {
            text += `;\n    ${finalSegment.id}->final`;
        }
        lastId = null;
    });

    codePath.thrownSegments.forEach(finalSegment => {
        if (lastId === finalSegment.id) {
            text += "->thrown";
        } else {
            text += `;\n    ${finalSegment.id}->thrown`;
        }
        lastId = null;
    });

    return `${text};`;
}

export default function CodePathExplorer({ codeValue, toolsLeft, languageOptions }) {

    const [graphviz, setGraphviz] = useState(initialGraphviz);
    const [codeOrGraph, setCodeOrGraph] = useState("graph");

    const codePathOptions = {
        codeOrGraph
    };

    const updateCodePathOptions = newOptions => {
        setCodeOrGraph(newOptions.codeOrGraph);
    };

    if (!graphviz) {
        void Graphviz.load().then(result => {
            initialGraphviz = result;
            setGraphviz(initialGraphviz);
        });
        return (
            <CodePathExplorerBase
                toolsLeft={toolsLeft}
                codePathOptions={codePathOptions}
                onUpdateCodePathOptions={updateCodePathOptions}>
                Loading...
            </CodePathExplorerBase>
        );
    }
    return (
        <CodePathExplorerWithGraphviz
            toolsLeft={toolsLeft}
            codePathOptions={codePathOptions}
            onUpdateCodePathOptions={updateCodePathOptions}
            codeValue={codeValue}
            languageOptions={languageOptions}
            graphviz={graphviz}
        />
    );
}

function CodePathExplorerBase({
    toolsLeft,
    codePathOptions, onUpdateCodePathOptions,
    toolsRight,
    children
}) {
    return (
        <div
            className={`code-path-explorer code-path-explorer--${codePathOptions.codeOrGraph}`}
        >
            <div
                className="code-path-explorer__tools"
            >
                {toolsLeft}
                <TabButtons
                    tabs={[
                        { value: "code", label: "Code" },
                        { value: "graph", label: "Graph" }
                    ]}
                    value={codePathOptions.codeOrGraph}
                    onChange={newValue => onUpdateCodePathOptions({ ...codePathOptions, codeOrGraph: newValue })}
                />
                {toolsRight}
            </div>
            <div
                className="code-path-explorer__main"
            >
                {children}
            </div>
        </div>
    );
}

function CodePathExplorerWithGraphviz({
    codeValue,
    languageOptions,
    toolsLeft,
    codePathOptions, onUpdateCodePathOptions,
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
            languageOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ...languageOptions,
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    },
                    ...languageOptions.parserOptions
                }
            }
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
                    "    node[shape=box,style=\"rounded,filled\",fillcolor=\"#fff\"];\n" +
                    "    initial[label=\"\",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];\n";

                if (codePath.returnedSegments.length > 0) {
                    text += "    final[label=\"\",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];\n";
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
    }, [codeValue, languageOptions]);

    if (extracted.error) {
        return (
            <CodePathExplorerBase
                toolsLeft={toolsLeft}
                codePathOptions={codePathOptions}
                onUpdateCodePathOptions={onUpdateCodePathOptions}
            >
                {extracted.error}
            </CodePathExplorerBase>
        );
    }

    return (
        <CodePathExplorerWithCodePathList
            toolsLeft={toolsLeft}
            codePathOptions={codePathOptions}
            onUpdateCodePathOptions={onUpdateCodePathOptions}
            graphviz={graphviz}
            codePathList={extracted.codePathList}
        />
    );
}

function CodePathExplorerWithCodePathList({
    toolsLeft,
    codePathOptions, onUpdateCodePathOptions,
    graphviz,
    codePathList
}) {

    const [selectedCodePathIndex, setSelectedCodePathIndex] = useState(codePathList.length - 1);
    let adjustSelectedCodePathIndex = selectedCodePathIndex;

    if (adjustSelectedCodePathIndex >= codePathList.length) {
        adjustSelectedCodePathIndex = codePathList.length - 1;
    }
    const dot = codePathList[adjustSelectedCodePathIndex].dot;

    return (
        <CodePathExplorerBase
            toolsLeft={toolsLeft}
            codePathOptions={codePathOptions}
            onUpdateCodePathOptions={onUpdateCodePathOptions}
            toolsRight={
                <div className="code-path-explorer__code-path-index-select">
                    <select
                        className="c-custom-select"
                        value={adjustSelectedCodePathIndex}
                        onChange={event => setSelectedCodePathIndex(event.target.value)}
                    >
                        {codePathList.map((_codePath, index) => (
                            <option
                                key={index}
                                value={index}
                            >
                            Code Path {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
            }
        >
            {
                codePathOptions.codeOrGraph !== "code"
                    ? <div
                        className="code-path-explorer__graph"
                        dangerouslySetInnerHTML={{ __html: graphviz.dot(dot) }}
                    />
                    : <pre >
                        {dot}
                    </pre>
            }

        </CodePathExplorerBase>
    );
}
