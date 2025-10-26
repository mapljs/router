import {
  createNode,
  insertItem as nodeInsertItem,
  type Node,
} from '../tree/node.js';

export type Router<T = unknown> = Record<string, Node<T>>;

export const createRouter = <T>(): Router<T> => ({});

export const insertItem = <T>(
  router: Router<T>,
  method: string,
  path: string,
  item: T,
): void => {
  nodeInsertItem((router[method] ??= createNode('/')), path, item);
};
