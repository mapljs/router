import { PARAMS, PATHNAME, PATHNAME_LEN } from '@mapl/router/constants';
import type { RouterCompilerState } from '@mapl/router/types';
import { getExternalKeys, getContent } from '@mapl/compiler';
import { compileRouter as compileRouterContent, type Router } from '@mapl/router/index';

export default function compileRouter(root: Router): (path: string, params: string[]) => any {
  const state: RouterCompilerState = {
    contentBuilder: [],
    declarationBuilders: [],
    localVarCount: 0,
    externalValues: [],

    compileItem: (item, state) => {
      state.contentBuilder.push(`return f${state.externalValues.length};`);
      state.externalValues.push(item);
    }
  };

  compileRouterContent(root, state);

  // eslint-disable-next-line
  return Function(
    ...getExternalKeys(state),
    `return (${PATHNAME},${PARAMS})=>{const ${PATHNAME_LEN}=${PATHNAME}.length;${getContent(state)}return null;}`
  )(...state.externalValues);
}
