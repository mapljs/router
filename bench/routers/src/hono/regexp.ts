import { RegExpRouter } from 'hono/router/reg-exp-router';
import type { Subject } from '../../cases.ts';

export default {
  'basic-api': () => {
    const router = new RegExpRouter<
      (paramArray: string[], paramIndexMap: Record<string, number>) => string
    >();

    router.add('GET', '/user', (_, _1) => '0');
    router.add('GET', '/user/comments', (_, _1) => '1');
    router.add('GET', '/user/avatar', (_, _1) => '2');
    router.add(
      'GET',
      '/user/lookup/username/:a',
      (arr, map) => '3: ' + arr[map.a],
    );
    router.add(
      'GET',
      '/user/lookup/email/:a',
      (arr, map) => '4: ' + arr[map.a],
    );
    router.add('GET', '/event/:a', (arr, map) => '5: ' + arr[map.a]);
    router.add('GET', '/event/:a/comments', (arr, map) => '6: ' + arr[map.a]);
    router.add('GET', '/map/:a/events', (arr, map) => '7: ' + arr[map.a]);
    router.add('GET', '/status', (_, _1) => '8');
    router.add('GET', '/very/deeply/nested/route/hello/there', (_, _1) => '9');

    router.add('POST', '/event/:a/comment', (arr, map) => '10: ' + arr[map.a]);

    return (method, path) => {
      const result = router.match(method, path);
      return result[0].length === 0
        ? ''
        : result[0][0][0](result[1], result[0][0][1] as Record<string, number>);
    };
  },
} satisfies Subject;
