import { PATH } from '@mapl/router/constants';
import type { RouterCompilerState } from '@mapl/router/types';
import { getExternalKeys } from '@mapl/compiler';
import { compileRouter as compileRouterContent, type Router } from '@mapl/router/index';

export default function compileRouter(root: Router): (path: string) => any {
  const state: RouterCompilerState = {
    contentBuilder: [] as string[],
    declarationBuilders: [] as any[],
    externalValues: [] as any[],

    compileItem: (item, state) => {
      state.contentBuilder.push(`return f${state.externalValues.push(item)};`);
    }
  };

  compileRouterContent(root, state);

  // eslint-disable-next-line
  return Function(
    ...getExternalKeys(state),
    `return (${PATH})=>{${state.contentBuilder.join('')}return null;}`
  )(...state.externalValues);
}
