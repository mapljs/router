import { describe, test, expect } from 'bun:test';

import { createRoot, insert, type Node } from '@mapl/router/tree/node';
import { compile } from '@mapl/router/tree/compiler';

import { PATH, PATH_LEN } from '@mapl/router/constants';

const compileRouter = (root: Node<any>): ((path: string) => any) => {
  const content = compile(root, 0, 1, '');
  try {
    return (0, eval)(`(${PATH})=>{let ${PATH_LEN}=${PATH}.length;${content}}`);
  } catch (e) {
    console.error(content);
    throw e;
  }
};

const runTest = (samplePaths: string[], label: string) => {
  // Build the tree
  const router = createRoot<string>();
  for (let i = 0; i < samplePaths.length; i++)
    insert(router, 1, samplePaths[i], 1, `return ${i}`);

  // Build result paths
  const resultPaths = samplePaths.map((pattern) =>
    pattern.endsWith('**') ? pattern.slice(0, -2) + '1/2/3/4' : pattern,
  );

  const compiled = compileRouter(router);
  console.log(label, compiled.toString(), '\n');

  describe(label, () => {
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

runTest(['/*/nested/a', '/*/nested/*'], 'Edge case 3');

runTest(['/api/*/sub/*', '/api/*/sub/**'], 'Reuse index tracker');

runTest(['/*/ab', '/*/bc'], 'Single character check');

runTest(['/*/a', '/*/b', '/*/c', '/*/d'], 'Children node checks');

runTest(
  ['/api/*/nested/*/2/*/nested', '/api/*/nested/**'],
  'Must not override index tracker',
);
