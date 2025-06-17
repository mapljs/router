import { createRouter, insertItem } from '@mapl/router/method';
import { countParams } from '@mapl/router/path';
import compile from '@mapl/router/method/compiler';
import type { Node } from '@mapl/router/tree/node.js';

import type { Subject } from '../cases.js';

export const tree = {
  'basic-api': () => {
    const matchNode = <T>(
      node: Node<T>,
      path: string,
      params: string[],
      start: number,
    ): T | undefined => {
      const part = node[0];
      const partLen = part.length;

      // Only check the part if its length is > 1 since the parent has
      // already checked that the url matches the first character
      if (
        partLen === 1 ||
        (start + partLen <= path.length && path.startsWith(part, start))
      ) {
        start += partLen;

        // Reached the end of the URL
        if (start === path.length && node[1] !== null) return node[1];

        // Check the next children node
        if (node[2] !== null) {
          const child = node[2][path.charCodeAt(start)];
          if (child != null) {
            const match = matchNode(child, path, params, start);
            if (match !== null) return match;
          }
        }

        // Check for parameters
        if (node[3] !== null) {
          const endIdx = path.indexOf('/', start);

          if (endIdx === -1) {
            if (node[3][1] !== null) {
              params.push(path.slice(start));
              return node[3][1];
            }
          } else if (endIdx > start && node[3][0] !== null) {
            params.push(path.slice(start, endIdx));

            const match = matchNode(node[3][0], path, params, endIdx);
            if (match !== null) return match;

            params.pop();
          }
        }

        // Wildcard
        if (node[4] !== null) {
          params.push(path.slice(start));
          return node[4];
        }
      }
    };

    type Handler = (params: string[]) => string;
    const router = createRouter<Handler>();

    insertItem(router, 'GET', '/user', () => '0');
    insertItem(router, 'GET', '/user/comments', () => '1');
    insertItem(router, 'GET', '/user/avatar', () => '2');
    insertItem(
      router,
      'GET',
      '/user/lookup/username/*',
      (params) => '3: ' + params[0],
    );
    insertItem(
      router,
      'GET',
      '/user/lookup/email/*',
      (params) => '4: ' + params[0],
    );
    insertItem(router, 'GET', '/event/*', (params) => '5: ' + params[0]);
    insertItem(
      router,
      'GET',
      '/event/*/comments',
      (params) => '6: ' + params[0],
    );
    insertItem(router, 'GET', '/map/*/events', (params) => '7: ' + params[0]);
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
      (params) => '10: ' + params[0],
    );

    // Build router
    const methodMap: Map<string, [Map<string, Handler>, Node<Handler> | null]> =
      new Map();
    for (const method in router) {
      const methodRouter = router[method];
      methodMap.set(method, [new Map(methodRouter[0]), methodRouter[1]]);
    }

    return (method, path) => {
      const tmp = methodMap.get(method);
      if (typeof tmp !== 'undefined') {
        const match = tmp[0].get(path);
        // @ts-ignore
        if (match != null) return match();

        if (tmp[1] !== null) {
          const params = [];
          const dmatch = matchNode(tmp[1], path, params, 0);
          if (dmatch != null) return dmatch(params);
        }
      }

      return '';
    };
  },
} satisfies Subject;

export const jit = {
  'basic-api': () => {
    const router = createRouter<string>();

    // Insert helper for mapl
    const insert = (method: string, pat: string, id: number) => {
      // Count params
      if (pat.includes('*')) {
        let str = 'return"' + id + ': "+q0';
        for (let i = 1, params = countParams(pat); i < params; i++)
          str += '+" - "+q' + i;
        insertItem(router, method, pat, str);
      } else insertItem(router, method, pat, 'return "' + id + '"');
    };

    insert('GET', '/user', 0);
    insert('GET', '/user/comments', 1);
    insert('GET', '/user/avatar', 2);
    insert('GET', '/user/lookup/username/*', 3);
    insert('GET', '/user/lookup/email/*', 4);
    insert('GET', '/event/*', 5);
    insert('GET', '/event/*/comments', 6);
    insert('GET', '/map/*/events', 7);
    insert('GET', '/status', 8);
    insert('GET', '/very/deeply/nested/route/hello/there', 9);

    insert('POST', '/event/*/comment', 10);

    return Function(`return(m,p)=>{${compile(router, 'm', '', 0)}return ""}`)();
  },
} satisfies Subject;
