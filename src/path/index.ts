import { insert, type Node } from '../tree/node.js';

/**
 * @example
 * [createNode('/'), '/', 'return new Response("Hi");', '/param/*', 'return new Response(p0)'];
 */
export type Router<T = unknown> = [...Node<T>, ...staticMap: any[]];

export const createRouter = <T>(): Router<T> => ['/', null, [], [], null, null];

export const insertItem = <T>(
  router: Router<T>,
  path: string,
  item: T,
): void => {
  path.includes('*')
    ? insert(router as any, 1, path, 1, item)
    : router.push(path, item);
};

export const createStaticMap = <T>(router: Router<T>): Map<string, T> => {
  const mp = new Map();
  for (let i = 6; i < router.length; i += 2) mp.set(router[i], router[i + 1]);
  return mp;
};
