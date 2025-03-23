import type { Node } from './node.js';

export type Compiler = (
  node: Node<string>,

  // Parameters count
  paramCount: number,

  // Current start index
  startIndexValue: number,
  startIndexPrefix: string
) => string;

const toChar = (c: [string, Node<string>]): string => String.fromCharCode(+c[0]);

export const o2: Compiler = (
  node, paramCount,
  startIndexValue, startIndexPrefix
) => {
  let builder = '';

  // Same optimization as in the matcher
  if (node[0].length !== 1) {
    const part = node[0];
    const start = startIndexPrefix + (startIndexValue + 1);

    builder += 'if(' + compilerConstants.PATH + (part.length === 2
      ? '[' + start + ']==="' + part[1] + '"'
      : '.startsWith("' + part.slice(1) + '",' + start + ')'
    ) + '){';

    startIndexValue += part.length;
  } else startIndexValue++;

  if (node[1] !== null) builder += 'if(' + compilerConstants.PATH_LEN + '===' + startIndexPrefix + startIndexValue + '){' + node[1] + '}';

  if (node[2] !== null) {
    const children = node[2];
    const childrenEntries = Object.entries(children);

    if (childrenEntries.length === 1) {
      // A single if statement is enough
      builder += 'if(' + compilerConstants.PATH + '[' + startIndexPrefix + startIndexValue + ']==="' + toChar(childrenEntries[0]) + '"){' + o2(
        childrenEntries[0][1],

        paramCount,

        startIndexValue,
        startIndexPrefix
      ) + '}';
    } else {
      // Setup switch cases
      builder += 'switch(' + compilerConstants.PATH + '[' + startIndexPrefix + startIndexValue + ']){';

      for (let i = 0; i < childrenEntries.length; i++) {
        builder += 'case"' + toChar(childrenEntries[i]) + '":' + o2(
          childrenEntries[i][1],

          paramCount,

          startIndexValue,
          startIndexPrefix
        ) + 'break;';
      }

      builder += '}';
    }
  }

  if (node[3] !== null) {
    const params = node[3];
    const hasStore = params[1] !== null;
    const hasChild = params[0] !== null;

    builder += '{';

    // Declare a variable to save previous param index
    if (paramCount > 0) builder += (paramCount > 1 ? '' : 'let ') + compilerConstants.PREV_PARAM_IDX + '=' + startIndexPrefix + startIndexValue + ';';

    const currentIndex = paramCount > 0
      ? compilerConstants.PREV_PARAM_IDX
      : startIndexPrefix + startIndexValue;
    const slashIndex = compilerConstants.PATH + '.indexOf("/"' + (currentIndex === '0' ? '' : ',' + currentIndex) + ')';

    // Need to save the current parameter index if the parameter node is not a leaf node
    if (hasChild || !hasStore) builder += (paramCount > 0 ? '' : 'let ') + compilerConstants.CURRENT_PARAM_IDX + '=' + slashIndex + ';';

    if (hasStore) {
      const paramsVal = currentIndex === '0'
        ? compilerConstants.PATH
        : compilerConstants.PATH + '.slice(' + currentIndex + ')';
      builder += 'if(' + (hasChild ? compilerConstants.CURRENT_PARAM_IDX : slashIndex) + '===-1){let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + params[1] + '}';
    }

    if (hasChild) {
      const paramsVal = compilerConstants.PATH + '.slice(' + currentIndex + ',' + compilerConstants.CURRENT_PARAM_IDX + ')';
      builder += 'if(' + compilerConstants.CURRENT_PARAM_IDX + '>' + currentIndex + '){let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + o2(
        params[0]!,
        paramCount + 1,
        0,
        compilerConstants.CURRENT_PARAM_IDX + '+'
      ) + '}';
    }

    builder += '}';
  }

  if (node[4] !== null) {
    const noStore = node[1] === null;
    const currentIndex = startIndexPrefix + startIndexValue;

    const paramsVal = currentIndex === '0'
      ? compilerConstants.PATH
      : compilerConstants.PATH + '.slice(' + currentIndex + ')';
    const body = 'let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + node[4];

    // Wildcard should not match static case
    builder += noStore
      ? 'if(' + compilerConstants.PATH_LEN + '>' + currentIndex + '){' + body + '}'
      : body;
  }

  return node[0].length !== 1 ? builder + '}' : builder;
};
