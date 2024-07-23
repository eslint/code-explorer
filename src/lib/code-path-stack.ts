// @ts-nocheck
/* eslint-disable */

const nodeToString = (node, label) => {
  const event = label ? `:${label}` : '';

  switch (node.type) {
    case 'Identifier': {
      return `${node.type}${event} (${node.name})`;
    }
    case 'Literal': {
      return `${node.type}${event} (${node.value})`;
    }
    default: {
      return `${node.type}${event}`;
    }
  }
};

export class CodePathStack {
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
      nodes: [],
    };

    this.currentSegments.set(segment, info);
    this.allSegments.set(segment, info);
  }

  exitSegment(segment) {
    this.currentSegments.delete(segment);
  }

  enterNode(node) {
    for (const codePathSegment of this.currentSegments.values()) {
      codePathSegment.nodes.push(nodeToString(node, 'enter'));
    }
  }

  exitNode(node) {
    for (const codePathSegment of this.currentSegments.values()) {
      const last = codePathSegment.nodes.length - 1;

      if (
        last >= 0 &&
        codePathSegment.nodes[last] === nodeToString(node, 'enter')
      ) {
        codePathSegment.nodes[last] = nodeToString(node, void 0);
      } else {
        codePathSegment.nodes.push(nodeToString(node, 'exit'));
      }
    }
  }
}
