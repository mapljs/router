import { createRoot, insert, type Node } from '../tree/node.js';

export type Router<T = unknown> =
  | [string[], Node<T>[], Map<string, T>[]]
  | [string[], Node<T>[], Map<string, T>[], Node<T>, Map<string, T>];

export const createRouter = <T>(): Router<T> => [[], [], []];

export const insertItem = <T>(
  router: Router<T>,
  method: string,
  path: string,
  item: T,
): void => {
  if (method !== '') {
    const idx = router[0].indexOf(method);
    if (idx > -1) {
      path.includes('*')
        ? insert(router[1][idx], 1, path, 1, item)
        : router[2][idx].set(path, item);
    } else {
      router[0].push(method);

      const node = createRoot<T>();
      router[1].push(node);

      const mp = new Map<string, T>();
      router[2].push(mp);

      path.includes('*')
        ? insert(node, 1, path, 1, item)
        : mp.set(path, item);
    }
  } else {
    router.length === 3 &&
      router.push(createRoot() as any, new Map<string, T>() as any);

    path.includes('*')
      ? insert(router[3]!, 1, path, 1, item)
      : router[4]!.set(path, item);
  }
};
