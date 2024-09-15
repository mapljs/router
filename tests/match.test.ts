import { describe, test, expect } from 'bun:test';

import { matchItem } from '@mapl/router/tree/matcher';
import { createNode, insertItem } from '@mapl/router/tree/node';

import { samplePaths, samplePathsLen, resultPaths } from './datasets/paths';
import compileMatcher from './utils/compileMatcher';

const root = createNode('/');
for (let i = 0; i < samplePathsLen; i++)
  insertItem(root, samplePaths[i], i);

describe('Should match correctly', () => {
  for (let i = 0; i < samplePathsLen; i++)
    test(`${samplePaths[i]}: ${i}`, () => {
      expect(matchItem(root, resultPaths[i], [], 0)).toBe(i);
    });
});

describe('Compile matcher correctly', () => {
  const match = compileMatcher(root);

  for (let i = 0; i < samplePathsLen; i++)
    test(`${samplePaths[i]}: ${i}`, () => {
      expect(match(resultPaths[i], [])).toBe(i);
    });
});
