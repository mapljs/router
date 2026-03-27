import type { Node } from './node.ts';

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

  node[1] === null || (builder += `if(${constants.PATH_LEN}===${currentIdx}){${node[1]}}`);

  if (node[2].length > 0) {
    const childrenFirstChar = node[2];
    const children = node[3];

    if (children.length > 1) {
      builder += `switch(${constants.PATH}.charCodeAt(${currentIdx})){`;

      for (let i = 0, checkIdx = idxPrefix + (idx + 1); i < children.length; i++) {
        const childNode = children[i],
          nodePart = childNode[0],
          nextIdx = idx + nodePart.length;

        builder +=
          'case ' +
          childrenFirstChar[i] +
          (shouldBoundCheck(childNode)
            ? `:if(${constants.PATH_LEN}>${idxPrefix + nextIdx})`
            : ':') +
          (nodePart.length > 2
            ? `if(${constants.PATH}.startsWith("${nodePart.slice(1)}",${checkIdx})){`
            : nodePart.length > 1
              ? `if(${constants.PATH}.charCodeAt(${checkIdx})===${nodePart.charCodeAt(1)}){`
              : '{') +
          compile(childNode, paramCount, nextIdx, idxPrefix) +
          '}';
      }

      builder += '}';
    } else {
      const childNode = children[0],
        nodePart = childNode[0],
        nodePartLen = nodePart.length;

      shouldBoundCheck(childNode) &&
        (builder += `if(${constants.PATH_LEN}>${idxPrefix + (idx + nodePartLen)})`);

      builder +=
        (nodePartLen > 1
          ? `if(${constants.PATH}.startsWith("${nodePart}",${currentIdx})){`
          : `if(${constants.PATH}.charCodeAt(${currentIdx})===${childrenFirstChar[0]}){`) +
        compile(childNode, paramCount, idx + nodePartLen, idxPrefix) +
        '}';
    }
  }

  if (node[4] !== null) {
    const params = node[4],
      hasChild = params[0] !== null;

    if (hasChild) {
      const childNode = params[0]!;

      // Declare a variable to save previous param index
      if (paramCount > 0) {
        builder += `let ${constants.PREV_PARAM_IDX}=${currentIdx};${constants.CURRENT_PARAM_IDX}=${constants.PATH}.indexOf("/",`;
        currentIdx = constants.PREV_PARAM_IDX;
      } else builder += `let ${constants.CURRENT_PARAM_IDX}=${constants.PATH}.indexOf("/",`;

      const needBoundCheck = shouldBoundCheck(childNode);

      builder +=
        currentIdx +
        `);if(${constants.CURRENT_PARAM_IDX}>` +
        currentIdx +
        (needBoundCheck
          ? `){if(${constants.PATH_LEN}>${constants.CURRENT_PARAM_IDX}+1){let ${constants.PARAMS}`
          : `){let ${constants.PARAMS}`) +
        paramCount +
        `=${constants.PATH}.slice(${currentIdx},${constants.CURRENT_PARAM_IDX});` +
        compile(childNode, paramCount + 1, 1, constants.CURRENT_PARAM_IDX + '+') +
        (needBoundCheck ? '}}' : '}');
    }

    params[1] !== null &&
      (builder +=
        (hasChild
          ? // CURRENT_PARAM_IDX has already been initialized
            `else if(${constants.CURRENT_PARAM_IDX}===-1){let ${constants.PARAMS}`
          : // Leaf node can use .includes instead of .indexOf
            `if(!${constants.PATH}.includes("/",${currentIdx})){let ${constants.PARAMS}`) +
        paramCount +
        (currentIdx === '0' ? `=${constants.PATH};` : `=${constants.PATH}.slice(${currentIdx});`) +
        params[1] +
        '}');
  }

  node[5] === null ||
    (builder +=
      `let ${constants.PARAMS}` +
      paramCount +
      (currentIdx === '0' ? `=${constants.PATH};` : `=${constants.PATH}.slice(${currentIdx});`) +
      node[5]);

  return builder;
};
