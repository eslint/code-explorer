import React, { useMemo, useState } from "react";
import { Graphviz } from "@hpcc-js/wasm";
import { Linter } from "../../node_modules/eslint/lib/linter/";

let initialGraphviz = null;

if (typeof process !== "undefined" && typeof process.cwd !== "function") {
    process.cwd = () => "/";
}

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
            text += `;\n${segment.id}->${nextSegment.id}`;
        }
        lastId = nextSegment.id;

        stack.unshift({ segment, index: 1 + index });
        stack.push({ segment: nextSegment, index: 0 });
    }

    codePath.returnedSegments.forEach(finalSegment => {
        if (lastId === finalSegment.id) {
            text += "->final";
        } else {
            text += `;\n${finalSegment.id}->final`;
        }
        lastId = null;
    });

    codePath.thrownSegments.forEach(finalSegment => {
        if (lastId === finalSegment.id) {
            text += "->thrown";
        } else {
            text += `;\n${finalSegment.id}->thrown`;
        }
        lastId = null;
    });

    return `${text};`;
}

export default function CodePathExplorer({ codeValue, options }) {

    const [graphviz, setGraphviz] = useState(initialGraphviz);

    if (!graphviz) {
        void Graphviz.load().then(r => {
            initialGraphviz = r;
            setGraphviz(initialGraphviz);
        });
        return <div>Loading...</div>;
    }
    return <CodePathExplorerWithGraphviz codeValue={codeValue} options={options} graphviz={graphviz}/>;
}

function CodePathExplorerWithGraphviz({ codeValue, options, graphviz }) {
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
                ...options,
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    },
                    ...options.parserOptions
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
                    "node[shape=box,style=\"rounded,filled\",fillcolor=white];\n" +
                    "initial[label=\"\",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];\n";

                if (codePath.returnedSegments.length > 0) {
                    text += "final[label=\"\",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];\n";
                }
                if (codePath.thrownSegments.length > 0) {
                    text +=
                        'thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];\n';
                }

                const arrows = makeDotArrows(codePath);

                for (const { segment, nodes } of target.getAllSegments()) {
                    text += `${segment.id}[`;

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

                text += `${arrows}\n`;
                text += "}";
                return {
                    dot: text,
                    node: target.startNode
                };
            })
        };
    }, [codeValue, options]);

    if (extracted.error) {
        return <div>{extracted.error}</div>;
    }

    // TODO: Code Path select
    const svg = graphviz.dot(extracted.codePathList[extracted.codePathList.length - 1].dot);

    return <div dangerouslySetInnerHTML={{ __html: svg }}></div>;
}
