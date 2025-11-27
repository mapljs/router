import {
  createNode,
  insertItem as nodeInsertItem,
  type Node,
} from '../tree/node.js';

/**
 * @example
 * [createNode('/'), '/', 'return new Response("Hi");', '/param/*', 'return new Response(p0)'];
 */
export type Router<T = unknown> = [
  root: Node<T>,
  // TS can't represent this type
  ...staticMap: any[],
];

export const createRouter = <T>(): Router<T> => [createNode('/')];

export const insertItem = <T>(
  router: Router<T>,
  path: string,
  item: T,
): void => {
  path.includes('*')
    ? nodeInsertItem(router[0], path, item)
    : router.push(path, item);
};
