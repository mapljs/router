import type { Router as PathRouter } from '../path/index.js';
import {
  createRouter as createPathRouter,
  insertItem as insertItemToPath
} from '../path/index.js';

export type Router<T = unknown> = Partial<Record<string, PathRouter<T>>>;

export const insertItem = <T>(router: Router<T>, method: string, path: string, item: T): void => {
  insertItemToPath(router[method] ??= createPathRouter(), path, item);
};
