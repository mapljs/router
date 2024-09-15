import type { Node } from '@mapl/router/tree/node';
import { PARAMS, PATHNAME, PATHNAME_LEN, compileNode, type RouterCompilerState } from '../../lib/tree/compiler';
import { getExternalKeys, getContent } from '@mapl/compiler';

export default function compileMatcher(root: Node): (path: string, params: string[]) => any {
  const state: RouterCompilerState<any> = {
    contentBuilder: [],
    declarationBuilders: [],
    localVarCount: 0,
    externalValues: [],

    compileItem: (item, state) => {
      state.contentBuilder.push(`return f${state.externalValues.length};`);
      state.externalValues.push(item);
    }
  };

  compileNode(root, state, false, false, 0, '');

  // eslint-disable-next-line
  return Function(
    ...getExternalKeys(state),
    `return (${PATHNAME},${PARAMS})=>{const ${PATHNAME_LEN}=${PATHNAME}.length;${getContent(state)}return null;}`
  )(...state.externalValues);
}
