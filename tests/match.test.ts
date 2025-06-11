import { describe, test, expect } from 'bun:test';

import { createRouter, insertItem } from '@mapl/router/path';
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
    const compiledO2 = compileRouter(router, 0);

    for (let i = 0; i < samplePaths.length; i++) {
      test(`${samplePaths[i]}`, () => {
        expect(compiledO2(resultPaths[i])).toBe(i);
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
