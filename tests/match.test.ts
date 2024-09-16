import { describe, test, expect } from 'bun:test';
import { createRouter, insertItem } from '@mapl/router/index';
import { samplePaths, samplePathsLen, resultPaths } from './datasets/paths';
import compileRouter from './utils/compileRouter';

const router = createRouter();
for (let i = 0; i < samplePathsLen; i++)
  insertItem(router, samplePaths[i], i);

describe('Compile router correctly', () => {
  const match = compileRouter(router);

  for (let i = 0; i < samplePathsLen; i++)
    test(`${samplePaths[i]}: ${i}`, () => {
      expect(match(resultPaths[i], [])).toBe(i);
    });
});
