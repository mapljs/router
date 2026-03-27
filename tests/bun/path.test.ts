import { describe, it, expect } from 'bun:test';

import { createRoot, insert, type Node } from '#self/tree/node';
import { match, init } from '#self/tree/match';
import { compile } from '#self/tree/compiler';

import { routesList } from '../routes.ts';

import { PATH, PATH_LEN } from '#self/constants';

describe('path', () => {
  const compileRouter = (root: Node<any>) => {
    const content = compile(root, 0, 1, '');
    try {
      return (0, eval)(`(${PATH})=>{let ${PATH_LEN}=${PATH}.length;${content}}`);
    } catch (e) {
      console.error(content);
      throw e;
    }
  };

  const runTest = (samplePatterns: string[], label: string) => {
    describe(label, () => {
      // Build the tree
      const compiledRouter = createRoot<string>();
      const router = createRoot<string>();

      let fn: (path: string) => any;

      for (let i = 0; i < samplePatterns.length; i++) {
        const pattern = samplePatterns[i];
        const path = pattern.endsWith('**') ? pattern.slice(0, -2) + '1/2/3/4' : pattern;

        insert(router, 1, pattern, 1, pattern);
        insert(compiledRouter, 1, pattern, 1, `return "${pattern}"`);

        describe(pattern, () => {
          describe('match', () => {
            it('compiled', () => {
              expect(fn(path)).toBe(pattern);
            });

            it('dfs', () => {
              init(path);
              expect(match(router, 1)).toBe(pattern);
            });
          });
        });
      }

      fn = compileRouter(compiledRouter);
    });
  };

  for (const [name, routes] of Object.entries(routesList))
    runTest(
      routes.map((route) => route[1]),
      name,
    );

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
    'simple api',
  );

  runTest(['/*/file', '/*'], 'edge case 1');
  runTest(['/api/works/*/lock', '/api/staff/*'], 'edge case 2');
  runTest(['/*/nested/a', '/*/nested/*'], 'edge case 3');

  runTest(['/api/*/sub/*', '/api/*/sub/**'], 'reuse index tracker');
  runTest(['/*/ab', '/*/bc'], 'single character check');
  runTest(['/*/a', '/*/b', '/*/c', '/*/d'], 'children node checks');
  runTest(['/api/*/nested/*/2/*/nested', '/api/*/nested/**'], 'must not override index tracker');
  runTest(['/user', '/user/*/dasboard', '/user/*/dashboard/edit'], 'nesting');
  runTest(['/user/*/dashboard', '/user/*/account', '/user/*/access'], 'branches');
});
