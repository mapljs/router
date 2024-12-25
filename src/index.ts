import { createNode, insertItem as nodeInsertItem, type Node } from './tree/node.js';

export type Router<T = string> = [staticMap: [path: string, item: T][], root: Node<T> | null];

// eslint-disable-next-line
export const createRouter = (): Router => [[], null],
  // eslint-disable-next-line
  insertItem = (router: Router, path: string, item: string): void => {
    if (path.includes('*'))
      nodeInsertItem(router[1] ??= createNode('/'), path, item);
    else
      router[0].push([path, item] as const);
  };
