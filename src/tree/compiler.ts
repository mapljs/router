import type { Node } from './node.js';

const toChar = (c: [string, Node<string>]): string =>
  String.fromCharCode(+c[0]);

export const compile = (
  node: Node<string>,
  paramCount: number,
  idx: number,
  idxPrefix: string,
): string => {
  let builder = '{';
  const noStore = node[1] == null;
  const partLen = node[0].length;

  let currentIdx = idxPrefix + (idx + partLen);

  // Skip checking first character since it's guaranteed to be checked
  if (partLen > 1) {
    const start = idxPrefix + (idx + 1);
    builder =
      partLen === 2
        ? // Prevent index out of bound causing deopt
          'if(' +
          constants.PATH_LEN +
          (noStore ? '>' : '>=') +
          currentIdx +
          ')if(' +
          constants.PATH +
          '[' +
          start +
          ']==="' +
          node[0][1] +
          '"){'
        : // Don't cause deopt for other paths
          (noStore
            ? 'if(' + constants.PATH_LEN + '>' + currentIdx + ')if('
            : 'if(') +
          constants.PATH +
          '.startsWith("' +
          node[0].slice(1) +
          '",' +
          start +
          ')){';
  }
  // Don't cause deopt for other paths
  else if (noStore)
    builder = 'if(' + constants.PATH_LEN + '>' + currentIdx + '){';
  idx += partLen;

  if (!noStore)
    builder +=
      'if(' + constants.PATH_LEN + '===' + currentIdx + '){' + node[1] + '}';

  if (node[2] != null) {
    const childrenEntries = Object.entries(node[2]);

    if (childrenEntries.length === 1) {
      // A single if statement is enough
      builder +=
        'if(' +
        constants.PATH +
        '[' +
        currentIdx +
        ']==="' +
        toChar(childrenEntries[0]) +
        '"){' +
        compile(
          childrenEntries[0][1],

          paramCount,

          idx,
          idxPrefix,
        ) +
        '}';
    } else {
      // Setup switch cases
      builder += 'switch(' + constants.PATH + '[' + currentIdx + ']){';

      for (let i = 0; i < childrenEntries.length; i++) {
        builder +=
          'case"' +
          toChar(childrenEntries[i]) +
          '":' +
          compile(
            childrenEntries[i][1],

            paramCount,

            idx,
            idxPrefix,
          ) +
          'break;';
      }

      builder += '}';
    }
  }

  if (node[3] != null) {
    const params = node[3];
    const hasStore = params[1] != null;
    const hasChild = params[0] != null;

    // Declare a variable to save previous param index
    if (paramCount > 0) {
      builder += 'let ' + constants.PREV_PARAM_IDX + '=' + currentIdx + ';';
      currentIdx = constants.PREV_PARAM_IDX;
    }

    let slashIndex =
      constants.PATH +
      '.indexOf("/"' +
      (currentIdx === '0' ? '' : ',' + currentIdx) +
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
        (currentIdx === '0'
          ? constants.PATH
          : constants.PATH + '.slice(' + currentIdx + ')') +
        ';' +
        params[1] +
        '}';

    if (hasChild)
      builder +=
        (hasStore ? 'else if(' : 'if(') +
        constants.CURRENT_PARAM_IDX +
        '>' +
        currentIdx +
        '){let ' +
        constants.PARAMS +
        paramCount +
        '=' +
        constants.PATH +
        '.slice(' +
        currentIdx +
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

  if (node[4] != null)
    builder +=
      'let ' +
      constants.PARAMS +
      paramCount +
      '=' +
      (currentIdx === '0'
        ? constants.PATH
        : constants.PATH + '.slice(' + currentIdx + ')') +
      ';' +
      node[4];

  return builder + '}';
};
