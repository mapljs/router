import { run, bench, summary, do_not_optimize } from 'mitata';

import { createRouter, insertItem } from '@mapl/router';
import { o2 } from '@mapl/router/tree/compiler';
import match from '@mapl/router/tree/matcher';
import quickMatch from '@mapl/router/quick-match';

import compileRouter from '../tests/utils/compileRouter';

function loadTest(label: string, samplePaths: string[]) {
  // Build the tree
  const router = createRouter<string>();
  for (let i = 0; i < samplePaths.length; i++) {
    if (!samplePaths[i].includes('*'))
      throw new Error('Path must be dynamic!');
    insertItem(router, samplePaths[i], `return ${i};`);
  }

  // Build result paths
  const resultPaths = samplePaths.map(
    (pattern) => pattern.endsWith('**')
      ? pattern.substring(0, pattern.length - 2) + '1/2/3'
      : pattern
  );

  summary(() => {
    const compiledO2 = compileRouter(router, o2);
    console.log('O2:', compiledO2.toString());

    console.log();

    bench(`${label} - O2`, () => {
      for (let i = 0; i < resultPaths.length; i++)
        do_not_optimize(compiledO2(resultPaths[i]));
    }).gc('inner');

    bench(`${label} - Tree match`, () => {
      for (let i = 0; i < resultPaths.length; i++)
        do_not_optimize(match(router[1]!, resultPaths[i], [], 0));
    }).gc('inner');

    bench(`${label} - Quick match`, () => {
      for (let i = 0; i < resultPaths.length; i++)
        do_not_optimize(quickMatch(samplePaths[i], resultPaths[i]));
    }).gc('inner');
  });
}

loadTest('Simple API', [
  '/*',
  '/*/navigate',
  '/**',

  '/user/*',
  '/user/*/dashboard/**',

  '/category/*',
  '/category/*/filter/*',
  '/category/*/filter/*/exclude'
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
