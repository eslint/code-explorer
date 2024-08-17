interface CodePathSegment {
  id: string;
  allNextSegments: CodePathSegment[];
  returned: boolean;
  thrown: boolean;
  reachable: boolean;
}

interface CodePath {
  initialSegment: CodePathSegment;
  returnedSegments: CodePathSegment[];
  thrownSegments: CodePathSegment[];
}

interface CodePathSegmentInfo {
  segment: CodePathSegment;
  nodes: string[];
}

const nodeToString = (node: any, label?: string): string => {
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
  codePath: CodePath;
  upper: CodePathStack | null;
  startNode: any;
  currentSegments: Map<CodePathSegment, CodePathSegmentInfo>;
  allSegments: Map<CodePathSegment, CodePathSegmentInfo>;

  constructor(codePath: CodePath, upper: CodePathStack | null, node: any) {
    this.codePath = codePath;
    this.upper = upper;
    this.startNode = node;

    this.currentSegments = new Map();
    this.allSegments = new Map();
  }

  getSegment(segment: CodePathSegment): CodePathSegmentInfo | undefined {
    return this.allSegments.get(segment);
  }

  getAllSegments(): IterableIterator<CodePathSegmentInfo> {
    return this.allSegments.values();
  }

  enterSegment(segment: CodePathSegment): void {
    const info: CodePathSegmentInfo = {
      segment,
      nodes: [],
    };

    this.currentSegments.set(segment, info);
    this.allSegments.set(segment, info);
  }

  exitSegment(segment: CodePathSegment): void {
    this.currentSegments.delete(segment);
  }

  enterNode(node: any): void {
    for (const codePathSegment of this.currentSegments.values()) {
      codePathSegment.nodes.push(nodeToString(node, 'enter'));
    }
  }

  exitNode(node: any): void {
    for (const codePathSegment of this.currentSegments.values()) {
      const last = codePathSegment.nodes.length - 1;

      if (
        last >= 0 &&
        codePathSegment.nodes[last] === nodeToString(node, 'enter')
      ) {
        codePathSegment.nodes[last] = nodeToString(node, undefined);
      } else {
        codePathSegment.nodes.push(nodeToString(node, 'exit'));
      }
    }
  }
}
