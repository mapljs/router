import { insert, type Node } from '../tree/node.js';

/**
 * @example
 * [createNode('/'), '/', 'return new Response("Hi");', '/param/*', 'return new Response(p0)'];
 */
export type Router<T = unknown> = [
  root: Node<T>,
  // TS can't represent this type
  ...staticMap: any[],
];

export const createRouter = <T>(): Router<T> => [['/', null, null, null, null]];

export const insertItem = <T>(
  router: Router<T>,
  path: string,
  item: T,
): void => {
  path.includes('*')
    ? insert(router[0], 1, path, 1, item)
    : router.push(path, item);
};

export const createStaticMap = <T>(router: Router<T>): Map<string, T> => {
  const mp = new Map();
  for (let i = 1; i < router.length; i += 2) mp.set(router[i], router[i + 1]);
  return mp;
};
