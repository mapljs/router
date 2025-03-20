import type { Router } from './index.js';
import match from '../tree/matcher.js';

// eslint-disable-next-line
const noop: (_: string, _1: string[]) => null = (_, _1) => null;

export type Matcher<T = unknown> = [Map<string, T>, (path: string, params: string[]) => T | null];

export default <T>(router: Router<T>, startIndex: 0 | -1): Matcher<T> => {
  const node = router[1];
  return [new Map(router[0]), node == null ? noop : (path, params) => match(node, path, params, startIndex)];
};
