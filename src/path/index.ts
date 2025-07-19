import {
  createNode,
  insertItem as nodeInsertItem,
  type Node,
} from '../tree/node.js';

export type Router<T = unknown> = [
  staticMap: [path: string, item: T][],
  root: Node<T> | undefined,
];

export const createRouter = <T>(): Router<T> => [[], ,];

export const insertItem = <T>(
  router: Router<T>,
  path: string,
  item: T,
): void => {
  if (path.includes('*'))
    nodeInsertItem((router[1] ??= createNode('/')), path, item);
  else router[0].push([path, item] as const);
};

export const countParams = (path: string): number => {
  let cnt = path.endsWith('**') ? 2 : 0;
  for (
    let i = path.length - cnt;
    (i = path.lastIndexOf('*', i - 1)) !== -1;
    cnt++
  );
  return cnt;
};
