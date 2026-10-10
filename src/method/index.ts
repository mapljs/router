import { createRoot, insert, type Node } from '../tree/node.ts';

export type Router<T = unknown> =
  | [string[], Map<string, T>[], Node<T>[]];

export const createRouter = <T>(): Router<T> => [[], [], []];

export const insertItem = <T>(router: Router<T>, method: string, path: string, item: T): void => {
  const idx = router[0].indexOf(method);
  if (idx > -1) {
    path.includes('*')
      ? insert(router[2][idx], 1, path, 1, item)
      : router[1][idx].set(path, item);
  } else {
    router[0].push(method);

    const node = createRoot<T>();
    router[2].push(node);

    const mp = new Map<string, T>();
    router[1].push(mp);

    path.includes('*') ? insert(node, 1, path, 1, item) : mp.set(path, item);
  }
};
