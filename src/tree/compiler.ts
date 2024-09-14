import type { Node } from './node';
import type { CompilerState } from '@mapl/compiler';

type ParametersExcludeState<T> = T extends (arg0: any, arg1: any, ...rest: infer R) => any ? R : never;

export interface RouterCompilerState<Item> extends CompilerState {
  compileItem: (item: Item, state: this, ...args: ParametersExcludeState<typeof compileNode>) => void;
}

// Compiler constants
export const PATHNAME = '__req_p';
export const PATHNAME_LEN = '__req_pl';
export const PARAMS = '__req_ps';
export const PREV_PARAM_INDEX = '__req_ppi';
export const CURRENT_PARAM_INDEX = '__req_cpi';

// __router_p is the pathname
export function compileNode(
  node: Node, state: RouterCompilerState<any>,

  // Whether the current path has a parameter
  hasParam: boolean,
  hasMultipleParams: boolean,

  // Current start index
  startIndexValue: number,
  startIndexPrefix: string
): void {
  const builder = state.contentBuilder;

  const part = node[0];
  const partLen = part.length;

  // Same optimization as in the matcher
  startIndexValue++;
  if (partLen !== 1) for (let i = 1; i < partLen; i++, startIndexValue++) builder.push(`if(${PATHNAME}.charCodeAt(${startIndexPrefix}${startIndexValue})===${part.charCodeAt(i)})`);

  if (node[1] !== null) {
    builder.push(`if(${PATHNAME_LEN}===${startIndexPrefix}${startIndexValue}){`);
    state.compileItem(node[1], state, hasParam, hasMultipleParams, startIndexValue, startIndexPrefix);
  }

  if (node[2] !== null) {
    const children = node[2];
    const childrenKeys = Object.keys(children);

    if (childrenKeys.length === 1) {
      // A single if statement is enough
      builder.push(`if(${PATHNAME}.charCodeAt(${startIndexPrefix}${startIndexValue})===${childrenKeys[0]}){`);
      // @ts-expect-error Key exists
      // eslint-disable-next-line
      compileNode(children[childrenKeys[0]], state, hasParam, hasMultipleParams, startIndexValue, startIndexPrefix);
      builder.push('}');
    } else {
      // Setup switch cases
      builder.push(`switch(${PATHNAME}.charCodeAt(${startIndexPrefix}${startIndexValue})){`);

      for (let i = 0, l = childrenKeys.length; i < l; i++) {
        builder.push(`case ${childrenKeys[i]}:{`);
        // @ts-expect-error Key exists
        // eslint-disable-next-line
        compileNode(children[childrenKeys[i]], state, hasParam, hasMultipleParams, startIndexValue, startIndexPrefix);
        builder.push('break;}');
      }

      builder.push('}');
    }
  }

  if (node[3] !== null) {
    const params = node[3];

    // Declare a variable to save previous param index
    if (hasParam) builder.push(`${hasMultipleParams ? '' : 'let '}${PREV_PARAM_INDEX}=${startIndexPrefix}${startIndexValue};`);

    const currentIndex = hasParam ? PREV_PARAM_INDEX : `${startIndexPrefix}${startIndexValue}`;
    const slashIndex = `${PATHNAME}.indexOf('/',${currentIndex});`;

    const hasStore = params[1] !== null;
    const hasChild = params[0] !== null;

    // Need to save the current parameter index if the parameter node is not a leaf node
    if (hasChild || !hasStore)
      builder.push(`${hasParam ? '' : 'let '}${CURRENT_PARAM_INDEX}=${slashIndex};`);

    if (hasStore) {
      builder.push(`if(${hasChild ? CURRENT_PARAM_INDEX : slashIndex}===-1){${PARAMS}.push(${PATHNAME}.slice(${currentIndex}));`);
      state.compileItem(params[1], state, true, hasParam, startIndexValue, startIndexPrefix);
      builder.push('}');
    }

    if (hasChild) {
      builder.push(`if(${hasStore ? '' : `${CURRENT_PARAM_INDEX}!==-1&&`}${CURRENT_PARAM_INDEX}!==${currentIndex}){${PARAMS}.push(${PATHNAME}.substring(${currentIndex},${CURRENT_PARAM_INDEX}));`);
      compileNode(params[0]!, state, true, hasParam, 1, `${CURRENT_PARAM_INDEX}+`);
      builder.push('}');
    }
  }

  if (node[4] !== null) {
    const noStore = node[1] === null;

    // Wildcard should not match static case
    if (noStore) builder.push(`if(${PATHNAME_LEN}!==${startIndexPrefix}${startIndexValue}){`);

    builder.push(`${PARAMS}.push(${PATHNAME}.slice(${startIndexPrefix}${startIndexValue}));`);
    state.compileItem(node[4], state, hasParam, hasMultipleParams, startIndexValue, startIndexPrefix);

    if (noStore) builder.push('}');
  }

  if (partLen !== 1)
    builder.push('}');
}
