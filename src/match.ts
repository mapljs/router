import type { Router } from './index.js';
import matchNode from './tree/matcher.js';

export type Matcher = (path: string, params: string[]) => unknown;

export default (router: Router<unknown>): Matcher => {
  const staticMap: Record<string, unknown> = {};
  router[0].forEach((item) => {
    staticMap[item[0].slice(1)] = item[1];
  });

  const rootNode = router[1];
  return rootNode === null
    ? (path: string) => staticMap[path] ?? null
    : (path: string, params: string[]) => staticMap[path] ?? matchNode(rootNode, path, params, -1);
};
