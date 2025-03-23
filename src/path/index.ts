import type { PathTransformResult } from '../transform.js';
import { createNode, insertItem as nodeInsertItem, insertItemWithParts as nodeInsertItemWithParts, type Node } from '../tree/node.js';

export type Router<T = unknown> = [staticMap: [path: string, item: T][], root: Node<T> | null];

export const createRouter = <T>(): Router<T> => [[], null];

export const insertItem = <T>(router: Router, path: string, item: T): void => {
  if (path.includes('*'))
    nodeInsertItem(router[1] ??= createNode('/'), path, item);
  else
    router[0].push([path, item] as const);
};

export const insertItemWithParts = <T>(
  router: Router<T>, result: PathTransformResult, item: T
): void => {
  if (result[2] === 0)
    router[0].push([result[1][0], item] as const);
  else
    nodeInsertItemWithParts(router[1] ??= createNode('/'), result, item);
};

export const countParams = (path: string): number => {
  let cnt = 0;
  for (let i = -1; (i = path.indexOf('*', i + 1)) !== -1; cnt++);
  return cnt - (path.endsWith('**') ? 1 : 0);
};
