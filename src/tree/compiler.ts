import type { Node } from './node.js';

export const shouldBoundCheck = (node: Node<string>): boolean =>
  // Has no store
  node[1] == null &&
  // Has two or more nodes
  (node[2].length !== 1 ||
    // Only child node part length is 1
    node[3][0][0].length === 1 ||
    // Has param
    node[4] !== null ||
    node[5] !== null);

export const compile = (
  node: Node<string>,
  paramCount: number,
  idx: number,
  idxPrefix: string,
): string => {
  let builder = '';
  let currentIdx = idxPrefix + idx;

  node[1] == null ||
    (builder += `if(${constants.PATH_LEN}===${currentIdx}){${node[1]}}`);

  if (node[2].length > 0) {
    const childrenFirstChar = node[2];
    const children = node[3];

    if (children.length > 1) {
      builder += `switch(${constants.PATH}.charCodeAt(${currentIdx})){`;

      for (let i = 0; i < children.length; i++) {
        const childNode = children[i];
        const nodePath = childNode[0];
        const nextIdx = idx + nodePath.length;

        builder +=
          'case ' +
          childrenFirstChar[i] +
          (shouldBoundCheck(childNode)
            ? `:if(${constants.PATH_LEN}>${idxPrefix + nextIdx})`
            : ':') +
          (nodePath.length > 1
            ? `if(${constants.PATH}` +
              (nodePath.length > 2
                ? `.startsWith("${nodePath.slice(1)}",${
                    idxPrefix + (idx + 1)
                  })){`
                : `.charCodeAt(${
                    idxPrefix + (idx + 1)
                  })===${nodePath.charCodeAt(1)}){`)
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
          ? `if(${constants.PATH_LEN}>${idxPrefix + nextIdx})if(${constants.PATH}`
          : `if(${constants.PATH}`) +
        (nodePath.length > 1
          ? `.startsWith("${nodePath}",${currentIdx})){`
          : `.charCodeAt(${currentIdx})===${childrenFirstChar[0]}){`) +
        compile(childNode, paramCount, nextIdx, idxPrefix) +
        '}';
    }
  }

  if (node[4] != null) {
    const params = node[4];
    const hasChild = params[0] != null;

    if (hasChild) {
      const childNode = params[0]!;

      // Declare a variable to save previous param index
      if (paramCount > 0) {
        builder += `let ${constants.PREV_PARAM_IDX}=${currentIdx};`;
        currentIdx = constants.PREV_PARAM_IDX;
      } else builder += 'let ';

      builder +=
        `${constants.CURRENT_PARAM_IDX}=${constants.PATH}.indexOf("/",${currentIdx});if(${constants.CURRENT_PARAM_IDX}>${currentIdx}){let ${constants.PARAMS}${paramCount}=${constants.PATH}.slice(` +
        currentIdx +
        (shouldBoundCheck(childNode)
          ? `,${constants.CURRENT_PARAM_IDX});if(${constants.PATH_LEN}>${constants.CURRENT_PARAM_IDX}+1){${compile(
              childNode,
              paramCount + 1,
              1,
              constants.CURRENT_PARAM_IDX + '+',
            )}}}`
          : `,${constants.CURRENT_PARAM_IDX});${compile(
              childNode,
              paramCount + 1,
              1,
              constants.CURRENT_PARAM_IDX + '+',
            )}}`);
    }

    params[1] != null &&
      (builder +=
        (hasChild
          ? // CURRENT_PARAM_IDX has already been initialized
            `else if(${constants.CURRENT_PARAM_IDX}===-1){let ${constants.PARAMS}`
          : // Leaf node can use .includes instead of .indexOf
            `if(!${constants.PATH}.includes("/",${currentIdx})){let ${constants.PARAMS}`) +
        paramCount +
        (currentIdx === '0'
          ? `=${constants.PATH};`
          : `=${constants.PATH}.slice(${currentIdx});`) +
        params[1] +
        '}');
  }

  node[5] == null ||
    (builder +=
      `let ${constants.PARAMS}` +
      paramCount +
      (currentIdx === '0'
        ? `=${constants.PATH};`
        : `=${constants.PATH}.slice(${currentIdx});`) +
      node[5]);

  return builder;
};
