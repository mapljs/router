import { createRouter, insertItem } from '@mapl/router/method';
import type { Node } from '@mapl/router/tree/node.js';

import type { Subject } from '../../cases.js';

const matchNode = <T>(
  node: Node<T>,
  path: string,
  params: string[],
  start: number,
): T | null => {
  const part = node[0];
  const partLen = part.length;

  // Only check the part if its length is > 1 since the parent has
  // already checked that the url matches the first character
  if (partLen === 1 || path.startsWith(part, start)) {
    start += partLen;

    // Reached the end of the URL
    if (start === path.length) return node[1];

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

  return null;
};

export default {
  'basic-api': () => {
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
          if (dmatch !== null) return dmatch(params);
        }
      }

      return '';
    };
  },
} satisfies Subject;
