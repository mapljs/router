import compileNode from './tree/compiler.js';
import { createNode, insertItem as nodeInsertItem, type Node } from './tree/node.js';

export type Router = [staticMap: Record<string, string> | null, root: Node | null];

export function createRouter(): Router {
  return [null, null];
}

export function insertItem(router: Router, path: string, item: string): void {
  if (path.includes('*'))
    nodeInsertItem(router[1] ??= createNode('/'), path, item);
  else
    (router[0] ??= {})[path] = item;
}

export function compileRouter(router: Router, contentBuilder: string[]): void {
  const hasStatic = router[0] !== null;

  if (hasStatic) {
    const staticMap = router[0];
    let hasMultiple = false;

    for (const key in staticMap) {
      contentBuilder.push(`${hasMultiple ? 'else ' : ''}if(${compilerConstants.PATH}==="${key.slice(1).replace(/"/g, '\\"')}"){${staticMap[key]}}`);
      hasMultiple = true;
    }
  }

  if (router[1] !== null) {
    if (hasStatic) contentBuilder.push('else{');

    contentBuilder.push(`let ${compilerConstants.PATH_LEN}=${compilerConstants.PATH}.length;`);
    compileNode(router[1], contentBuilder, false, false, -1, '');

    if (hasStatic) contentBuilder.push('}');
  }
}
