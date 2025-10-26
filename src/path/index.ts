import {
  createNode,
  insertItem as nodeInsertItem,
  type Node,
} from '../tree/node.js';

export type Router<T = unknown> = [
  staticMap: [path: string, item: T][],
  root: Node<T> | null,
];

export const createRouter = <T>(): Router<T> => [[], null];

export const insertItem = <T>(
  router: Router<T>,
  path: string,
  item: T,
): void => {
  if (path.includes('*'))
    nodeInsertItem((router[1] ??= createNode('/')), path, item);
  else router[0].push([path, item] as const);
};
