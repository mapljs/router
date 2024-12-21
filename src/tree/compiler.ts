import type { Node } from './node.js';

// eslint-disable-next-line
const f = (
  node: Node,
  builder: string[],

  // Whether the current path has a parameter
  hasParam: boolean,
  hasMultipleParams: boolean,

  // Current start index
  startIndexValue: number,
  startIndexPrefix: string
): void => {
  const part = node[0];
  const partLen = part.length;

  // Same optimization as in the matcher
  if (partLen !== 1) {
    builder.push(`if(${compilerConstants.PATH_LEN}>${startIndexPrefix}${startIndexValue + partLen - 1})`);
    for (let i = 1; i < partLen; i++) builder.push(`if(${compilerConstants.PATH}.charCodeAt(${startIndexPrefix}${startIndexValue + i})===${part.charCodeAt(i)})`);
    builder.push('{');
  }
  startIndexValue += partLen;

  if (node[1] !== null)
    builder.push(`if(${compilerConstants.PATH_LEN}===${startIndexPrefix}${startIndexValue}){${node[1]}}`);

  if (node[2] !== null) {
    const children = node[2];
    const childrenEntries = Object.entries(children);

    if (childrenEntries.length === 1) {
      // A single if statement is enough
      builder.push(`if(${compilerConstants.PATH}.charCodeAt(${startIndexPrefix}${startIndexValue})===${childrenEntries[0][0]}){`);
      f(
        childrenEntries[0][1],
        builder,
        hasParam,
        hasMultipleParams,
        startIndexValue,
        startIndexPrefix
      );
      builder.push('}');
    } else {
      // Setup switch cases
      builder.push(`switch(${compilerConstants.PATH}.charCodeAt(${startIndexPrefix}${startIndexValue})){`);

      for (let i = 0, l = childrenEntries.length; i < l; i++) {
        builder.push(`case ${childrenEntries[i][0]}:`);
        f(
          childrenEntries[i][1],
          builder,
          hasParam,
          hasMultipleParams,
          startIndexValue,
          startIndexPrefix
        );
        builder.push('break;');
      }

      builder.push('}');
    }
  }

  if (node[3] !== null) {
    const params = node[3];
    const hasStore = params[1] !== null;
    const hasChild = params[0] !== null;

    // Whether to wrap the parameter check in a scope
    const requireAllocation = hasParam
      ? hasMultipleParams
      : hasChild || !hasStore;
    if (requireAllocation) builder.push('{');

    // Declare a variable to save previous param index
    if (hasParam)
      builder.push(`${hasMultipleParams ? '' : 'let '}${compilerConstants.PREV_PARAM_IDX}=${startIndexPrefix}${startIndexValue};`);

    const currentIndex = hasParam
      ? compilerConstants.PREV_PARAM_IDX
      : startIndexPrefix + startIndexValue;
    const slashIndex = `${compilerConstants.PATH}.indexOf('/'${
      currentIndex === '0'
        ? ''
        // eslint-disable-next-line
        : ',' + currentIndex})`;

    // Need to save the current parameter index if the parameter node is not a leaf node
    if (hasChild || !hasStore)
      builder.push(`${hasParam ? '' : 'let '}${compilerConstants.CURRENT_PARAM_IDX}=${slashIndex};`);

    if (hasStore) {
      const paramsVal = currentIndex === '0'
        ? compilerConstants.PATH
        : `${compilerConstants.PATH}.slice(${currentIndex})`;
      builder.push(`if(${hasChild ? compilerConstants.CURRENT_PARAM_IDX : slashIndex}===-1){${hasParam ? `${compilerConstants.PARAMS}.push(${paramsVal})` : `let ${compilerConstants.PARAMS}=[${paramsVal}]`};${params[1]}}`);
    }

    if (hasChild) {
      const paramsVal = `${compilerConstants.PATH}.substring(${currentIndex},${compilerConstants.CURRENT_PARAM_IDX})`;
      builder.push(`if(${compilerConstants.CURRENT_PARAM_IDX}${hasStore ? '!==' : '>'}${currentIndex}){${hasParam ? `${compilerConstants.PARAMS}.push(${paramsVal})` : `let ${compilerConstants.PARAMS}=[${paramsVal}]`};`);
      f(
        params[0]!,
        builder,
        true,
        hasParam,
        0,
        `${compilerConstants.CURRENT_PARAM_IDX}+`
      );

      // Don't need to pop when scope is closed
      if (!requireAllocation) builder.push(`${compilerConstants.PARAMS}.pop();`);

      builder.push('}');
    }

    // Close the scope
    if (requireAllocation) builder.push('}');
  }

  if (node[4] !== null) {
    const noStore = node[1] === null;
    const currentIndex = startIndexPrefix + startIndexValue;

    // Wildcard should not match static case
    if (noStore) builder.push(`if(${compilerConstants.PATH_LEN}!==${currentIndex}){`);

    const paramsVal = currentIndex === '0'
      ? compilerConstants.PATH
      : `${compilerConstants.PATH}.slice(${currentIndex})`;
    builder.push(`${hasParam ? `${compilerConstants.PARAMS}.push(${paramsVal})` : `let ${compilerConstants.PARAMS}=[${paramsVal}]`};${node[4]}`);

    if (noStore) builder.push('}');
  }

  if (partLen !== 1) builder.push('}');
};

export default f;
