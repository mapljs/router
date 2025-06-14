import type { Node } from './node.js';

const toChar = (c: [string, Node<string>]): string => String.fromCharCode(+c[0]);

export const compile = (
  node: Node<string>, paramCount: number,
  startIndexValue: number, startIndexPrefix: string
): string => {
  let builder = '';

  // Same optimization as in the matcher
  if (node[0] !== '/') {
    const part = node[0];
    const start = startIndexPrefix + (startIndexValue + 1);

    builder += 'if(' + compilerConstants.PATH + (part.length === 2
      ? '[' + start + ']==="' + part[1] + '"'
      : '.startsWith("' + part.slice(1) + '",' + start + ')'
    ) + '){';

    startIndexValue += part.length;
  } else startIndexValue++;

  let currentIndex = startIndexPrefix + startIndexValue;

  if (node[1] !== null) builder += 'if(' + compilerConstants.PATH_LEN + '===' + currentIndex + '){' + node[1] + '}';

  if (node[2] !== null) {
    const children = node[2];
    const childrenEntries = Object.entries(children);

    if (childrenEntries.length === 1) {
      // A single if statement is enough
      builder += 'if(' + compilerConstants.PATH + '[' + currentIndex + ']==="' + toChar(childrenEntries[0]) + '"){' + compile(
        childrenEntries[0][1],

        paramCount,

        startIndexValue,
        startIndexPrefix
      ) + '}';
    } else {
      // Setup switch cases
      builder += 'switch(' + compilerConstants.PATH + '[' + currentIndex + ']){';

      for (let i = 0; i < childrenEntries.length; i++) {
        builder += 'case"' + toChar(childrenEntries[i]) + '":{' + compile(
          childrenEntries[i][1],

          paramCount,

          startIndexValue,
          startIndexPrefix
        ) + 'break;}';
      }

      builder += '}';
    }
  }

  if (node[3] !== null) {
    const params = node[3];
    const hasStore = params[1] !== null;
    const hasChild = params[0] !== null;

    // Declare a variable to save previous param index
    if (paramCount > 0) {
      builder += 'let ' + compilerConstants.PREV_PARAM_IDX + '=' + currentIndex + ';';
      currentIndex = compilerConstants.PREV_PARAM_IDX;
    }

    let slashIndex = compilerConstants.PATH + '.indexOf("/"' + (currentIndex === '0' ? '' : ',' + currentIndex) + ')';

    // Need to save the current parameter index if the parameter node is not a leaf node
    if (hasChild || !hasStore) {
      builder += (paramCount > 0 ? '' : 'let ') + compilerConstants.CURRENT_PARAM_IDX + '=' + slashIndex + ';';
      slashIndex = compilerConstants.CURRENT_PARAM_IDX;
    }

    if (hasStore) {
      const paramsVal = currentIndex === '0'
        ? compilerConstants.PATH
        : compilerConstants.PATH + '.slice(' + currentIndex + ')';
      builder += 'if(' + slashIndex + '===-1){let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + params[1] + '}';
    }

    if (hasChild) {
      const paramsVal = compilerConstants.PATH + '.slice(' + currentIndex + ',' + compilerConstants.CURRENT_PARAM_IDX + ')';
      builder += 'if(' + compilerConstants.CURRENT_PARAM_IDX + '>' + currentIndex + '){let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + compile(
        params[0]!,
        paramCount + 1,
        0,
        compilerConstants.CURRENT_PARAM_IDX + '+'
      ) + '}';
    }
  }

  if (node[4] !== null) {
    const noStore = node[1] === null;

    const paramsVal = currentIndex === '0'
      ? compilerConstants.PATH
      : compilerConstants.PATH + '.slice(' + currentIndex + ')';
    const body = 'let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + node[4];

    // Wildcard should not match static case
    builder += noStore
      ? 'if(' + compilerConstants.PATH_LEN + '>' + currentIndex + '){' + body + '}'
      : body;
  }

  return node[0] !== '/' ? builder + '}' : builder;
};
