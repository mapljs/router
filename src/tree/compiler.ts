import type { Node } from './node.js';

export const shouldBoundCheck = (node: Node<string>): boolean =>
  node[1] == null;

export const compile = (
  node: Node<string>,
  paramCount: number,
  idx: number,
  idxPrefix: string,
): string => {
  let builder = '';
  let currentIdx = idxPrefix + idx;

  node[1] == null ||
    (builder +=
      'if(' + constants.PATH_LEN + '===' + currentIdx + '){' + node[1] + '}');

  if (node[2] != null) {
    const children = Object.values(node[2]);

    if (children.length > 1) {
      builder +=
        'switch(' + constants.PATH + '.charCodeAt(' + currentIdx + ')){';

      for (let i = 0; i < children.length; i++) {
        const childNode = children[i];
        const nodePath = childNode[0];
        const nextIdx = idx + nodePath.length;

        builder +=
          'case ' +
          nodePath.charCodeAt(0) +
          (shouldBoundCheck(childNode)
            ? ':if(' + constants.PATH_LEN + '>' + idxPrefix + nextIdx + ')'
            : ':') +
          (nodePath.length > 1
            ? 'if(' +
              constants.PATH +
              '.startsWith("' +
              nodePath.slice(1) +
              '",' +
              idxPrefix +
              (idx + 1) +
              ')){'
            : '{') +
          compile(childNode, paramCount, nextIdx, idxPrefix) +
          '}';
      }

      builder += '}';
    } else {
      const childNode = children[0];
      const nodePath = childNode[0];
      const nextIdx = idx + nodePath.length;

      builder +=
        (shouldBoundCheck(childNode)
          ? 'if(' +
            constants.PATH_LEN +
            '>' +
            idxPrefix +
            nextIdx +
            ')if(' +
            constants.PATH +
            '.startsWith("'
          : 'if(' + constants.PATH + '.startsWith("') +
        nodePath +
        '",' +
        currentIdx +
        ')){' +
        compile(childNode, paramCount, nextIdx, idxPrefix) +
        '}';
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

    // Need to save the current parameter index if the parameter node is not a leaf node
    (hasChild || !hasStore) &&
      (builder +=
        (paramCount > 0
          ? constants.CURRENT_PARAM_IDX + '=' + constants.PATH + '.indexOf("/",'
          : 'let ' +
            constants.CURRENT_PARAM_IDX +
            '=' +
            constants.PATH +
            '.indexOf("/",') +
        currentIdx +
        ');');

    hasStore &&
      (builder +=
        (hasChild
          ? 'if(' +
            constants.CURRENT_PARAM_IDX +
            '===-1){let ' +
            constants.PARAMS
          : // Leaf node can use .includes instead of .indexOf
            'if(!' +
            constants.PATH +
            '.includes("/",' +
            currentIdx +
            ')){let ' +
            constants.PARAMS) +
        paramCount +
        (currentIdx === '0'
          ? '=' + constants.PATH + ';'
          : '=' + constants.PATH + '.slice(' + currentIdx + ');') +
        params[1] +
        '}');

    if (hasChild) {
      const childNode = params[0]!;

      builder +=
        (hasStore
          ? 'else if(' + constants.CURRENT_PARAM_IDX + '>'
          : 'if(' + constants.CURRENT_PARAM_IDX + '>') +
        currentIdx +
        '){let ' +
        constants.PARAMS +
        paramCount +
        '=' +
        constants.PATH +
        '.slice(' +
        currentIdx +
        (shouldBoundCheck(childNode)
          ? ',' +
            constants.CURRENT_PARAM_IDX +
            ');if(' +
            constants.PATH_LEN +
            '>' +
            constants.CURRENT_PARAM_IDX +
            '+1){' +
            compile(
              childNode,
              paramCount + 1,
              1,
              constants.CURRENT_PARAM_IDX + '+',
            ) +
            '}}'
          : ',' +
            constants.CURRENT_PARAM_IDX +
            ');' +
            compile(
              childNode,
              paramCount + 1,
              1,
              constants.CURRENT_PARAM_IDX + '+',
            ) +
            '}');
    }
  }

  node[4] == null ||
    (builder +=
      'let ' +
      constants.PARAMS +
      paramCount +
      (currentIdx === '0'
        ? '=' + constants.PATH + ';'
        : '=' + constants.PATH + '.slice(' + currentIdx + ');') +
      node[4]);

  return builder;
};
