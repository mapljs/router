import { describe, it, expect } from 'bun:test';

import { createRouter, insertItem } from '$/method';
import compile from '$/method/compiler';
import { PATH } from '$/constants';

import { routesList, type RouteList } from '../routes.ts';

describe('method', () => {
  const runTest = (name: string, routeList: RouteList) => {
    describe(name, () => {
      let fn: (method: string, path: string) => string;

      const router = createRouter<string>();
      for (let i = 0; i < routeList.length; i++) {
        const [method, path, id] = routeList[i];
        insertItem(router, method, path, `return "${id}"`);

        describe(id, () => {
          describe('match', () => {
            it('compiled', () => {
              expect(fn(method, path)).toBe(id);
            });
          });
        });
      }

      fn = (0, eval)(`(m,${PATH})=>{${compile(router, 'm', 1)}return ''}`);
    });
  };

  for (const [name, routes] of Object.entries(routesList)) runTest(name, routes);
});
