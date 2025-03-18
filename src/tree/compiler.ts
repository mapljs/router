import type { Node } from './node.js';

const f = (
  node: Node,

  // Parameters count
  paramCount: number,

  // Current start index
  startIndexValue: number,
  startIndexPrefix: string
): string => {
  let builder = '';

  // Same optimization as in the matcher
  if (node[0] !== '/') {
    const part = node[0];
    const len = part.length;

    builder += 'if(' + compilerConstants.PATH_LEN + '>' + startIndexPrefix + (startIndexValue + len - 1) + ')';
    for (let i = 1; i < len; i++) builder += 'if(' + compilerConstants.PATH + '.charCodeAt(' + startIndexPrefix + (startIndexValue + i) + ')===' + part.charCodeAt(i) + ')';
    builder += '{';

    startIndexValue += len;
  } else startIndexValue++;

  if (node[1] !== null) builder += 'if(' + compilerConstants.PATH_LEN + '===' + startIndexPrefix + startIndexValue + '){' + node[1] + '}';

  if (node[2] !== null) {
    const children = node[2];
    const childrenEntries = Object.entries(children);

    if (childrenEntries.length === 1) {
      // A single if statement is enough
      builder += 'if(' + compilerConstants.PATH + '.charCodeAt(' + startIndexPrefix + startIndexValue + ')===' + childrenEntries[0][0] + '){' + f(
        childrenEntries[0][1],

        paramCount,

        startIndexValue,
        startIndexPrefix
      ) + '}';
    } else {
      // Setup switch cases
      builder += 'switch(' + compilerConstants.PATH + '.charCodeAt(' + startIndexPrefix + startIndexValue + ')){';

      for (let i = 0; i < childrenEntries.length; i++) {
        builder += 'case ' + childrenEntries[i][0] + ':' + f(
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

    // Whether to wrap the parameter check in a scope
    const requireAllocation = paramCount > 1 || hasChild || !hasStore;
    if (requireAllocation) builder += '{';

    // Declare a variable to save previous param index
    if (paramCount > 0) builder += (paramCount > 1 ? '' : 'let ') + compilerConstants.PREV_PARAM_IDX + '=' + startIndexPrefix + startIndexValue + ';';

    const currentIndex = paramCount > 0
      ? compilerConstants.PREV_PARAM_IDX
      : startIndexPrefix + startIndexValue;
    const slashIndex = compilerConstants.PATH + '.indexOf(\'/\'' + (currentIndex === '0' ? '' : ',' + currentIndex) + ')';

    // Need to save the current parameter index if the parameter node is not a leaf node
    if (hasChild || !hasStore) builder += (paramCount > 0 ? '' : 'let ') + compilerConstants.CURRENT_PARAM_IDX + '=' + slashIndex + ';';

    if (hasStore) {
      const paramsVal = currentIndex === '0'
        ? compilerConstants.PATH
        : compilerConstants.PATH + '.slice(' + currentIndex + ')';
      builder += 'if(' + (hasChild ? compilerConstants.CURRENT_PARAM_IDX : slashIndex) + '===-1){let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + params[1] + '}';
    }

    if (hasChild) {
      const paramsVal = compilerConstants.PATH + '.substring(' + currentIndex + ',' + compilerConstants.CURRENT_PARAM_IDX + ')';
      builder += 'if(' + compilerConstants.CURRENT_PARAM_IDX + (hasStore ? '!==' : '>') + currentIndex + '){let ' + compilerConstants.PARAMS + paramCount + '=' + paramsVal + ';' + f(
        params[0]!,
        paramCount + 1,
        0,
        compilerConstants.CURRENT_PARAM_IDX + '+'
      ) + '}';
    }

    // Close the scope
    if (requireAllocation) builder += '}';
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
      ? 'if(' + compilerConstants.PATH_LEN + '!==' + currentIndex + '){' + body + '}'
      : body;
  }

  return node[0] === '/' ? builder : builder + '}';
};

export default f;
