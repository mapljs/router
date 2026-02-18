import type { Router as PathRouter } from '../path/index.js';
import {
  createRouter as createPathRouter,
  insertItem as insertItemToPath,
} from '../path/index.js';

export type Router<T = unknown> =
  | [string[], PathRouter<T>[]]
  | [string[], PathRouter<T>[], PathRouter<T>];

export const createRouter = <T>(): Router<T> => [[], []];

export const insertItem = <T>(
  router: Router<T>,
  method: string,
  path: string,
  item: T,
): void => {
  if (method.length > 0) {
    const idx = router[0].indexOf(method);
    if (idx > -1) insertItemToPath(router[1][idx], path, item);
    else {
      const newRouter = createPathRouter<T>();
      insertItemToPath(newRouter, path, item);
      router[0].push(method);
      router[1].push(newRouter);
    }
  } else {
    router.length === 2 && router.push(createPathRouter());
    insertItemToPath(router[2]!, path, item);
  }
};
