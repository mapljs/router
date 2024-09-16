import { PATHNAME, compileNode, type RouterCompilerState } from './tree/compiler';
import { createNode, insertItem as nodeInsertItem, type Node } from './tree/node';

export type Router = [staticMap: Record<string, any> | null, root: Node | null];

export function insertItem(router: Router, path: string, item: any): void {
  if (path.includes('*'))
    nodeInsertItem(router[1] ??= createNode('/'), path, item);
  else
    // eslint-disable-next-line
    (router[0] ??= {})[path] = item;
}

export function compileRouter(router: Router, state: RouterCompilerState<any>): void {
  if (router[0] !== null) {
    const staticMap = router[0];
    const contentBuilder = state.contentBuilder;

    for (const key in staticMap) {
      contentBuilder.push(`if(${PATHNAME}===${JSON.stringify(key)}){`);
      state.compileItem(staticMap[key], state, false);
      contentBuilder.push('}');
    }
  }

  if (router[1] !== null)
    compileNode(router[1], state, false, false, -1, '');
}
