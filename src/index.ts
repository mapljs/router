import { PATH } from './constants';
import { compileNode } from './tree/compiler';
import { createNode, insertItem as nodeInsertItem, type Node } from './tree/node';
import type { RouterCompilerState } from './types';

export type Router = [staticMap: Record<string, unknown> | null, root: Node | null];

export function createRouter(): Router {
  return [null, null];
}

export function insertItem(router: Router, path: string, item: any): void {
  if (path.includes('*'))
    nodeInsertItem(router[1] ??= createNode('/'), path, item);
  else
    (router[0] ??= {})[path] = item;
}

export function compileRouter(router: Router, state: RouterCompilerState): void {
  if (router[0] !== null) {
    const staticMap = router[0];
    const contentBuilder = state.contentBuilder;

    for (const key in staticMap) {
      contentBuilder.push(`if(${PATH}===${JSON.stringify(key.slice(1))}){`);
      state.compileItem(staticMap[key], state, false);
      contentBuilder.push('}');
    }
  }

  if (router[1] !== null)
    compileNode(router[1], state, false, false, -1, '');
}
