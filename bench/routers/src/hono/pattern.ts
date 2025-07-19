import { PatternRouter } from 'hono/router/pattern-router';
import type { Subject } from '../../cases.js';

export default {
  'basic-api': () => {
    const router = new PatternRouter<
      (params: Record<string, string>) => string
    >();

    router.add('GET', '/user', (_) => '0');
    router.add('GET', '/user/comments', (_) => '1');
    router.add('GET', '/user/avatar', (_) => '2');
    router.add('GET', '/user/lookup/username/:a', (map) => '3: ' + map.a);
    router.add('GET', '/user/lookup/email/:a', (map) => '4: ' + map.a);
    router.add('GET', '/event/:a', (map) => '5: ' + map.a);
    router.add('GET', '/event/:a/comments', (map) => '6: ' + map.a);
    router.add('GET', '/map/:a/events', (map) => '7: ' + map.a);
    router.add('GET', '/status', (_) => '8');
    router.add('GET', '/very/deeply/nested/route/hello/there', (_) => '9');

    router.add('POST', '/event/:a/comment', (map) => '10: ' + map.a);

    return (method, path) => {
      const result = router.match(method, path);
      return result[0].length === 0
        ? ''
        : result[0][0][0](result[0][0][1] as Record<string, string>);
    };
  },
} satisfies Subject;
