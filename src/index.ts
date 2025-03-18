import { createNode, insertItem as nodeInsertItem, type Node } from './tree/node.js';

export type Router<T = unknown> = [staticMap: [path: string, item: T][], root: Node<T> | null];

export const createRouter = (): Router => [[], null];

export const insertItem = (router: Router, path: string, item: string): void => {
  if (path.includes('*'))
    nodeInsertItem(router[1] ??= createNode('/'), path, item);
  else
    router[0].push([path, item] as const);
};

export const countParams = (path: string): number => {
  let cnt = 0;
  for (let i = -1; (i = path.indexOf('*', i + 1)) !== -1; cnt++);
  return cnt - (path.endsWith('**') ? 1 : 0);
};
