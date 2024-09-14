import { describe, test, expect } from 'bun:test';

import { matchItem } from '@mapl/router/tree/matcher';
import { PARAMS, PATHNAME, PATHNAME_LEN, compileNode, type RouterCompilerState } from '@mapl/router/tree/compiler';
import { createNode, insertItem } from '@mapl/router/tree/node';
import { getExternalKeys, getContent } from '@mapl/compiler';

import { samplePaths, samplePathsLen } from './datasets/paths';

const resultPaths = samplePaths.map((pattern) => pattern.endsWith('**') ? pattern.substring(0, pattern.length - 2) + '1/2/3' : pattern);

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
  const state: RouterCompilerState<any> = {
    contentBuilder: [],
    declarationBuilders: [],
    localVarCount: 0,
    externalValues: [],

    compileItem: (item, state) => {
      const itemId = state.externalValues.length;
      state.externalValues.push(item);
      state.contentBuilder.push(`return f${itemId};`);
    }
  };

  compileNode(root, state, false, false, 0, '');

  // eslint-disable-next-line
  const match = Function(
    ...getExternalKeys(state),
    `return (${PATHNAME},${PARAMS})=>{const ${PATHNAME_LEN}=${PATHNAME}.length;${getContent(state)}return null;}`
  )(...state.externalValues);

  console.log(match.toString());

  for (let i = 0; i < samplePathsLen; i++)
    test(`${samplePaths[i]}: ${i}`, () => {
      expect(match(resultPaths[i], [])).toBe(i);
    });
});
