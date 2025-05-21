import type { Router as PathRouter } from '../path/index.js';
import {
  createRouter as createPathRouter,
  insertItem as insertItemToPath
} from '../path/index.js';

export const ALL: unique symbol = Symbol();
export type ALL = typeof ALL;

export type Method = string | ALL;
export type Router<T = unknown> = Partial<Record<Method, PathRouter<T>>>;

export const insertItem = <T>(router: Router<T>, method: Method, path: string, item: T): void => {
  insertItemToPath(router[method] ??= createPathRouter(), path, item);
};
