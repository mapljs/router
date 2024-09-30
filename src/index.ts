import { PATH, PATH_LEN } from './constants.js';
import { compileNode } from './tree/compiler.js';
import { createNode, insertItem as nodeInsertItem, type Node } from './tree/node.js';
import type { RouterCompilerState } from './types.js';

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
  const contentBuilder = state.contentBuilder;
  const hasStatic = router[0] !== null;

  if (hasStatic) {
    const staticMap = router[0];
    let hasMultiple = false;

    for (const key in staticMap) {
      contentBuilder.push(`${hasMultiple ? 'else ' : ''}if(${PATH}===${JSON.stringify(key.slice(1))}){`);
      state.compileItem(staticMap[key], state, false);
      contentBuilder.push('}');
      hasMultiple = true;
    }
  }

  if (hasStatic) contentBuilder.push('else{');

  contentBuilder.push(`let ${PATH_LEN}=${PATH}.length;`);
  if (router[1] !== null)
    compileNode(router[1], state, false, false, -1, '');

  if (hasStatic) contentBuilder.push('}');
}
