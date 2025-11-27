import { createRouter, insertItem } from '@mapl/router/method';
import type { Node } from '@mapl/router/tree/node';

import type { Subject } from '../../cases.ts';
import type { Router as PathRouter } from '@mapl/router/path';

const state = [[], 1] as const;

const addHandler = (a: [any, number[]]) => {
  // @ts-ignore
  state[0][state[1]++] = a;
};

const resetState = () => {
  // @ts-ignore
  state[0] = [];
  // @ts-ignore
  state[1] = 1;
};

// @ts-ignore
const markParam = (paramMap: number[]) => [...paramMap, state[1]++] as any;

const compileRegExpSource = (node: Node<any>, paramMap: number[]): string => {
  const parts: string[] = [];

  if (node[1] != null) {
    addHandler([node[1], paramMap]);
    parts.push('($)');
  }

  if (node[2] != null)
    for (const key in node[2])
      parts.push(compileRegExpSource(node[2][key], paramMap));

  if (node[3] != null) {
    let builder = '([^/]+)';
    const newParamMap = markParam(paramMap);

    const params = node[3];
    if (params[0] != null) {
      if (params[1] != null) {
        addHandler([params[1], newParamMap]);
        builder += '(?:($)|';
      }

      builder += compileRegExpSource(params[0], newParamMap);

      if (params[1] != null) builder += ')';
    } else {
      // Param should should have child or store or both
      addHandler([params[1], newParamMap]);
      builder += '($)';
    }

    parts.push(builder);
  }

  if (node[4] != null) {
    addHandler([node[4], markParam(paramMap)]);
    parts.push('(.*$)()');
  }

  return (
    // @ts-ignore Works in Node 24
    RegExp.escape(node[0]) +
    // Only wrap if necessary
    (parts.length > 1 ? '(?:' + parts.join('|') + ')' : parts[0])
  );
};

export const createMap = <T>(router: PathRouter<T>): Map<string, T> => {
  const mp = new Map();
  for (let i = 1; i < router.length; i += 2)
    mp.set(router[i], router[i + 1]);
  return mp;
}

export default {
  'basic-api': () => {
    type Handler = (match: RegExpExecArray, paramsMap: number[]) => string;
    const router = createRouter<Handler>();

    insertItem(router, 'GET', '/user', () => '0');
    insertItem(router, 'GET', '/user/comments', () => '1');
    insertItem(router, 'GET', '/user/avatar', () => '2');
    insertItem(
      router,
      'GET',
      '/user/lookup/username/*',
      (match, params) => '3: ' + match[params[0]],
    );
    insertItem(
      router,
      'GET',
      '/user/lookup/email/*',
      (match, params) => '4: ' + match[params[0]],
    );
    insertItem(
      router,
      'GET',
      '/event/*',
      (match, params) => '5: ' + match[params[0]],
    );
    insertItem(
      router,
      'GET',
      '/event/*/comments',
      (match, params) => '6: ' + match[params[0]],
    );
    insertItem(
      router,
      'GET',
      '/map/*/events',
      (match, params) => '7: ' + match[params[0]],
    );
    insertItem(router, 'GET', '/status', () => '8');
    insertItem(
      router,
      'GET',
      '/very/deeply/nested/route/hello/there',
      () => '9',
    );

    insertItem(
      router,
      'POST',
      '/event/*/comment',
      (match, params) => '10: ' + match[params[0]],
    );

    // Build router
    const methodMap: Map<
      string,
      | [Map<string, Handler>]
      | [Map<string, Handler>, RegExp, store: [Handler, number[]][]]
    > = new Map();
    for (const method in router) {
      const methodRouter = router[method];
      const arr: any[] = [createMap(methodRouter)];

      resetState();
      arr.push(
        new RegExp('^' + compileRegExpSource(methodRouter[0], [])),
        state[0],
      );

      methodMap.set(method, arr as any);
    }

    return (method, path) => {
      const tmp = methodMap.get(method);
      if (typeof tmp !== 'undefined') {
        const match = tmp[0].get(path);
        // @ts-ignore
        if (match != null) return match();

        if (tmp.length > 2) {
          const dmatch = tmp[1]!.exec(path);
          if (dmatch !== null) {
            const store = tmp[2]![dmatch.indexOf('', 1)];
            return store[0](dmatch, store[1]);
          }
        }
      }

      return '';
    };
  },
} satisfies Subject;
