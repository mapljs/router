import type { Node } from './node.js';

const toChar = (c: [string, Node<string>]): string =>
  String.fromCharCode(+c[0]);

export const compile = (
  node: Node<string>,
  paramCount: number,
  startIndexValue: number,
  startIndexPrefix: string,
): string => {
  let builder = '';

  // Same optimization as in the matcher
  if (node[0] !== '/') {
    const part = node[0];
    const start = startIndexPrefix + (startIndexValue + 1);

    builder +=
      'if(' +
      constants.PATH +
      (part.length === 2
        ? '[' + start + ']==="' + part[1] + '"'
        : '.startsWith("' + part.slice(1) + '",' + start + ')') +
      '){';

    startIndexValue += part.length;
  } else startIndexValue++;

  let currentIndex = startIndexPrefix + startIndexValue;

  if (node[1] !== null)
    builder +=
      'if(' + constants.PATH_LEN + '===' + currentIndex + '){' + node[1] + '}';

  if (node[2] !== null) {
    const childrenEntries = Object.entries(node[2]);

    if (childrenEntries.length === 1) {
      // A single if statement is enough
      builder +=
        'if(' +
        constants.PATH +
        '[' +
        currentIndex +
        ']==="' +
        toChar(childrenEntries[0]) +
        '"){' +
        compile(
          childrenEntries[0][1],

          paramCount,

          startIndexValue,
          startIndexPrefix,
        ) +
        '}';
    } else {
      // Setup switch cases
      builder += 'switch(' + constants.PATH + '[' + currentIndex + ']){';

      for (let i = 0; i < childrenEntries.length; i++) {
        builder +=
          'case"' +
          toChar(childrenEntries[i]) +
          '":{' +
          compile(
            childrenEntries[i][1],

            paramCount,

            startIndexValue,
            startIndexPrefix,
          ) +
          'break}';
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
      builder += 'let ' + constants.PREV_PARAM_IDX + '=' + currentIndex + ';';
      currentIndex = constants.PREV_PARAM_IDX;
    }

    let slashIndex =
      constants.PATH +
      '.indexOf("/"' +
      (currentIndex === '0' ? '' : ',' + currentIndex) +
      ')';

    // Need to save the current parameter index if the parameter node is not a leaf node
    if (hasChild || !hasStore) {
      builder +=
        (paramCount > 0 ? '' : 'let ') +
        constants.CURRENT_PARAM_IDX +
        '=' +
        slashIndex +
        ';';
      slashIndex = constants.CURRENT_PARAM_IDX;
    }

    if (hasStore)
      builder +=
        'if(' +
        slashIndex +
        '===-1){let ' +
        constants.PARAMS +
        paramCount +
        '=' +
        (currentIndex === '0'
          ? constants.PATH
          : constants.PATH + '.slice(' + currentIndex + ')') +
        ';' +
        params[1] +
        '}';

    if (hasChild)
      builder +=
        'if(' +
        constants.CURRENT_PARAM_IDX +
        '>' +
        currentIndex +
        '){let ' +
        constants.PARAMS +
        paramCount +
        '=' +
        constants.PATH +
        '.slice(' +
        currentIndex +
        ',' +
        constants.CURRENT_PARAM_IDX +
        ');' +
        compile(
          params[0]!,
          paramCount + 1,
          0,
          constants.CURRENT_PARAM_IDX + '+',
        ) +
        '}';
  }

  if (node[4] !== null) {
    const body =
      'let ' +
      constants.PARAMS +
      paramCount +
      '=' +
      (currentIndex === '0'
        ? constants.PATH
        : constants.PATH + '.slice(' + currentIndex + ')') +
      ';' +
      node[4];

    // Wildcard should not match static case
    builder +=
      node[1] === null
        ? 'if(' + constants.PATH_LEN + '>' + currentIndex + '){' + body + '}'
        : body;
  }

  return node[0] !== '/' ? builder + '}' : builder;
};
