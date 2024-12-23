import compileNode from './tree/compiler.js';
import { createNode, insertItem as nodeInsertItem, type Node } from './tree/node.js';

export type Router = [staticMap: [path: string, item: string][], root: Node | null];

// eslint-disable-next-line
export const createRouter = (): Router => [[], null],
  // eslint-disable-next-line
  insertItem = (router: Router, path: string, item: string): void => {
    if (path.includes('*'))
      nodeInsertItem(router[1] ??= createNode('/'), path, item);
    else
      router[0].push([path, item] as const);
  },
  // eslint-disable-next-line
  compileRouter = (router: Router): string => {
    const builder = router[0].length === 0
      ? ''
      : `switch(${compilerConstants.PATH}){${router[0]
        .map((pair) => `case "${pair[0].slice(1).replace(/"/g, '\\"')}":{${pair[1]}break;}`)
        .join('')
      }}`;

    return router[1] === null
      ? builder
      : `${builder}let ${compilerConstants.PATH_LEN}=${compilerConstants.PATH}.length;${compileNode(router[1], false, false, -1, '')}`;
  };
