import { describe, test, expect } from 'bun:test';

import { createRouter, insertItem } from '@mapl/router/path';

import quickMatch from '@mapl/router/quick-match';
import compileMatch from '@mapl/router/path/matcher';

import { o2 } from '@mapl/router/tree/compiler';
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
    const compiledO2 = compileRouter(router, o2, 0);
    const [staticMap, match] = compileMatch(router, 0);

    for (let i = 0; i < samplePaths.length; i++) {
      test(`${samplePaths[i]} - O2`, () => {
        expect(compiledO2(resultPaths[i])).toBe(i);
      });

      test(`${samplePaths[i]} - Tree match`, () => {
        expect(staticMap.get(resultPaths[i]) ?? match(resultPaths[i], [])).not.toBeNil();
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
