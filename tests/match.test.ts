import { describe, test, expect } from 'bun:test';

import { createRouter, insertItem } from '@mapl/router';
import { o2 } from '@mapl/router/tree/compiler';
import quickMatch from '@mapl/router/quick-match';
import match from '@mapl/router/tree/matcher';

import compileRouter from './utils/compileRouter';

function runTest(samplePaths: string[]) {
  // Build the tree
  const router = createRouter<string>();
  for (let i = 0; i < samplePaths.length; i++)
    insertItem(router, samplePaths[i], `return ${i};`);

  // Build result paths
  const resultPaths = samplePaths.map(
    (pattern) => pattern.endsWith('**')
      ? pattern.substring(0, pattern.length - 2) + '1/2/3'
      : pattern
  );

  describe('["' + samplePaths.join('", "') + '"]', () => {
    const compiledO2 = compileRouter(router, o2);

    const staticMap = Object.fromEntries(router[0]);

    for (let i = 0; i < samplePaths.length; i++) {
      test(`${samplePaths[i]} - O2`, () => {
        expect(compiledO2(resultPaths[i])).toBe(i);
      });

      test(`${samplePaths[i]} - Tree match`, () => {
        expect(staticMap[resultPaths[i]] ?? (router[1] ? match(router[1], resultPaths[i], [], 0) : null)).not.toBeNil();
      });

      test(`${samplePaths[i]} - Quick match`, () => {
        expect(quickMatch(samplePaths[i], resultPaths[i])).not.toBeNil();
      });
    }
  });
}

runTest([
  '/',
  '/about',

  '/*',
  '/*/navigate',
  '/**',

  '/user/*',
  '/user/*/dashboard/**',

  '/category/*',
  '/category/*/filter/*',
  '/category/*/filter/*/exclude',
]);

runTest([
  '/*/file',
  '/*'
]);

runTest([
  '/api/works/*/lock',
  '/api/staff/*'
]);
