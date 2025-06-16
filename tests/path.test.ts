import { describe, test, expect } from 'bun:test';

import { createRouter, insertItem } from '@mapl/router/path';
import compileRouter from './utils/compileRouter';

const runTest = (samplePaths: string[], label: string) => {
  // Build the tree
  const router = createRouter<string>();
  for (let i = 0; i < samplePaths.length; i++)
    insertItem(router, samplePaths[i], `return ${i};`);

  // Build result paths
  const resultPaths = samplePaths.map((pattern) =>
    pattern.endsWith('**') ? pattern.slice(0, -2) + '1/2/3/4' : pattern,
  );

  describe(label, () => {
    const compiled = compileRouter(router, 0);
    console.log(label + ':', compiled.toString());
    console.log();

    for (let i = 0; i < samplePaths.length; i++) {
      test(`${samplePaths[i]}`, () => {
        expect(compiled(resultPaths[i])).toBe(i);
      });
    }
  });
};

runTest(
  [
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
  ],
  'Simple API',
);

runTest(['/*/file', '/*'], 'Edge case 1');

runTest(['/api/works/*/lock', '/api/staff/*'], 'Edge case 2');

runTest(['/api/*/sub/*', '/api/*/sub/**'], 'Reuse index tracker');

runTest(
  ['/api/*/nested/*/2/*/nested', '/api/*/nested/**'],
  'Must not override index tracker',
);
