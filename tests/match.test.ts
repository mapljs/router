import { describe, test, expect } from 'bun:test';

import { matchItem } from '@mapl/router/tree/matcher';
import { createNode, insertItem } from '@mapl/router/tree/node';
import { samplePaths, samplePathsLen } from './datasets/paths';

function toPath(pattern: string) {
  return pattern.endsWith('**') ? pattern.substring(0, pattern.length - 2) + '1/2/3' : pattern;
}

const root = createNode('/');
for (let i = 0; i < samplePathsLen; i++)
  insertItem(root, samplePaths[i], i);

console.log(root)

describe('Should match correctly', () => {
  for (let i = 0; i < samplePathsLen; i++)
    test(`${samplePaths[i]}: ${i}`, () => {
      expect(matchItem(root, toPath(samplePaths[i]), [], 0)).toBe(i);
    });
});
