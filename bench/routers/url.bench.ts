import { group, run, bench } from 'mitata';
import { samplePaths, samplePathsLen, resultPaths } from '../../tests/datasets/paths';
import compileMatcher from '../../tests/utils/compileMatcher';

import { matchItem } from '../../lib/tree/matcher';
import { createNode, insertItem } from '../../lib/tree/node';

bench('noop', () => { });
bench('noop2', () => { });

group('URL routers', () => {
  const tree = createNode('/');
  for (let i = 0; i < samplePathsLen; i++)
    insertItem(tree, samplePaths[i], i);

  // Normal matcher
  {
    bench('Recursive', () => {
      for (let i = 0, _; i < samplePathsLen; i++)
        _ = matchItem(tree, resultPaths[i], [], 0);
    });
  }

  // Compiled matcher
  {
    const match = compileMatcher(tree);
    bench('Compiled', () => {
      for (let i = 0, _; i < samplePathsLen; i++)
        _ = match(resultPaths[i], []);
    });
  }
});

run();
