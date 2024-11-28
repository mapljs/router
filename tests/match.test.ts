import { describe, test, expect } from 'bun:test';
import { createRouter, insertItem } from '@mapl/router/index';
import compileRouter from './utils/compileRouter';

function runTest(samplePaths: string[]) {
  // Build the tree
  const router = createRouter();
  for (let i = 0; i < samplePaths.length; i++)
    insertItem(router, samplePaths[i], `return ${i};`);
  console.log(Bun.inspect(router));

  // Build result paths
  const resultPaths = samplePaths.map(
    (pattern) => pattern.endsWith('**')
      ? pattern.substring(1, pattern.length - 2) + '1/2/3'
      : pattern.slice(1)
  );

  describe(samplePaths.join(' - '), () => {
    const match = compileRouter(router);
    console.log(match.toString());

    for (let i = 0; i < samplePaths.length; i++)
      test(`${samplePaths[i]}: ${i}`, () => {
        expect(match(resultPaths[i])).toBe(i);
      });
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
