import { run, bench, summary, do_not_optimize } from 'mitata';

import { createRouter, insertItem } from '@mapl/router/path';

import quickMatch from '@mapl/router/quick-match';
import compileMatch from '@mapl/router/path/matcher';

import { o2 } from '@mapl/router/tree/compiler';
import compileRouter from '../tests/utils/compileRouter';

function loadTest(label: string, samplePaths: string[]) {
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

  summary(() => {
    const compiledO2 = compileRouter(router, o2, 0);
    const [staticMap, match] = compileMatch(router, 0);

    bench(`${label} - O2`, () => {
      for (let i = 0; i < resultPaths.length; i++)
        do_not_optimize(compiledO2(resultPaths[i]));
    });

    bench(`${label} - Tree match`, () => {
      for (let i = 0; i < resultPaths.length; i++)
        do_not_optimize(staticMap.get(resultPaths[i]) ?? match(resultPaths[i], []));
    });

    bench(`${label} - Quick match`, () => {
      for (let j = 0; j < resultPaths.length; j++) {
        const path = resultPaths[j];
        if (staticMap.get(path) == null)
          for (let i = 0; i < samplePaths.length; i++)
            do_not_optimize(quickMatch(samplePaths[i], path));
      }
    });
  });
}

loadTest('Simple API', [
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

loadTest('Same base 1', [
  '/*/file',
  '/*'
]);

loadTest('Same base 2', [
  '/api/works/*/lock',
  '/api/staff/*'
]);

run();
