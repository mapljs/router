import type { Matcher as PathMatcher } from '../path/matcher.js';
import compileMatch from '../path/matcher.js';
import { ALL, type Router } from './index.js';

export type Matcher<T> = [Map<string, PathMatcher<T>>, PathMatcher<T> | null];

export default <T>(router: Router<T>, startIndex: 0 | -1): Matcher<T> => [
  new Map(Object.entries(router).map((pair) => [pair[0], compileMatch(pair[1]!, startIndex)] as const)),
  router[ALL] == null ? null : compileMatch(router[ALL], startIndex)
];
