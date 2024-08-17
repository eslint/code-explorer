'use server';

import { Linter } from 'eslint-linter-browserify';
import { CodePathStack } from '@/lib/code-path-stack';
import type { SourceType, Version } from '@/hooks/use-explorer';

const makeDotArrows = (codePath: any) => {
  const stack = [{ segment: codePath.initialSegment, index: 0 }];
  const done: Record<string, any> = Object.create(null);
  let lastId = codePath.initialSegment.id;
  let text = `initial->${codePath.initialSegment.id}`;

  while (stack.length > 0) {
    const { segment, index } = stack.pop()!;

    if (done[segment.id] && index === 0) {
      continue;
    }
    done[segment.id] = segment;

    const nextSegment = segment.allNextSegments[index];

    if (!nextSegment) {
      continue;
    }

    text +=
      lastId === segment.id
        ? `->${nextSegment.id}`
        : ` [color="#98A2B3"];\n    ${segment.id}->${nextSegment.id}`;
    lastId = nextSegment.id;

    stack.unshift({ segment, index: 1 + index });
    stack.push({ segment: nextSegment, index: 0 });
  }

  for (const finalSegment of codePath.returnedSegments) {
    text +=
      lastId === finalSegment.id
        ? '->final'
        : ` [color="#98A2B3"];\n    ${finalSegment.id}->final`;
    lastId = null;
  }

  for (const finalSegment of codePath.thrownSegments) {
    text +=
      lastId === finalSegment.id
        ? '->thrown'
        : ` [color="#98A2B3"];\n    ${finalSegment.id}->thrown`;
    lastId = null;
  }

  return `${text} [color="#98A2B3"];`;
};

export const generateCodePath = async (
  code: string,
  esVersion: Version,
  sourceType: SourceType
): Promise<
  | {
    error: string;
  }
  | {
    response: string;
  }
> => {
  const linter = new Linter({ configType: 'flat' });

  let stack: CodePathStack | null = null;
  const allCodePaths: CodePathStack[] = [];

  const config: any = {
    files: ['**/*.js', '*.js'],
    plugins: {
      'code-path': {
        rules: {
          'extract-code-path': {
            create() {
              return {
                onCodePathStart(codePath: any, node: any) {
                  stack = new CodePathStack(codePath, stack, node);
                  allCodePaths.push(stack);
                },
                onCodePathEnd() {
                  stack = stack?.upper || null;
                },
                onCodePathSegmentStart(segment: any) {
                  stack?.enterSegment(segment);
                },
                onUnreachableCodePathSegmentStart(segment: any) {
                  stack?.enterSegment(segment);
                },
                onCodePathSegmentEnd(segment: any) {
                  stack?.exitSegment(segment);
                },
                onUnreachableCodePathSegmentEnd(segment: any) {
                  stack?.exitSegment(segment);
                },
                '*'(node: any) {
                  stack?.enterNode(node);
                },
                '*:exit'(node: any) {
                  stack?.exitNode(node);
                },
              };
            },
          },
        },
      },
    },
    rules: {
      'code-path/extract-code-path': 'error',
    },
    languageOptions: {
      ecmaVersion: esVersion,
      sourceType,
    },
  };

  try {
    const messages = linter.verify(code, config, 'a.js');

    if (allCodePaths.length === 0) {
      if (messages && messages.length > 0 && messages[0].fatal) {
        return { error: messages[0].message };
      }
      return {
        error: 'Unknown error',
      };
    }
  } catch (error) {
    return {
      error: (error as Error).message,
    };
  }

  const response = {
    codePathList: allCodePaths.map((target) => {
      const { codePath } = target;

      let text =
        '\n' +
        'digraph {\n' +
        '    bgcolor="transparent";\n' +
        '    node[shape=box,style="rounded,filled",fillcolor=white,color="#E4E7EC"];\n' +
        '    initial[label="",shape=circle,style=filled,fillcolor="#98A2B3",color="#98A2B3",width=0.25,height=0.25];\n';

      if (codePath.returnedSegments.length > 0) {
        text +=
          '    final[label="",shape=doublecircle,style=filled,fillcolor="#98A2B3",color="#98A2B3",width=0.25,height=0.25];\n';
      }
      if (codePath.thrownSegments.length > 0) {
        text +=
          '    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];\n';
      }

      const arrows = makeDotArrows(codePath);

      for (const { segment, nodes } of target.getAllSegments()) {
        text += `    ${segment.id}[`;

        text += segment.reachable
          ? 'label="'
          : String.raw`style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\n`;

        text += nodes && nodes.length > 0 ? nodes.join(String.raw`\n`) : '????';

        text += '"];\n';
      }

      text += `    ${arrows}\n`;
      text += '}';
      return {
        dot: text,
        // node: target.startNode,
      };
    }),
  };

  return { response: JSON.stringify(response, null, 2) };
};
