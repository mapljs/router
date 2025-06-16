import type { Subject } from '../cases.js';
import Router from 'trek-router';

export default {
  'basic-api': () => {
    const router = new Router();

    router.add('GET', '/user', (_) => '0');
    router.add('GET', '/user/comments', (_) => '1');
    router.add('GET', '/user/avatar', (_) => '2');
    router.add(
      'GET',
      '/user/lookup/username/:a',
      (map) => '3: ' + map[0].value,
    );
    router.add('GET', '/user/lookup/email/:a', (map) => '4: ' + map[0].value);
    router.add('GET', '/event/:a', (map) => '5: ' + map[0].value);
    router.add('GET', '/event/:a/comments', (map) => '6: ' + map[0].value);
    router.add('GET', '/map/:a/events', (map) => '7: ' + map[0].value);
    router.add('GET', '/status', (_) => '8');
    router.add('GET', '/very/deeply/nested/route/hello/there', (_) => '9');

    router.add('POST', '/event/:a/comment', (map) => '10: ' + map[0].value);

    return (method, path) => {
      // @ts-ignore
      const match = router.find(method, path);
      return typeof match[0] === 'undefined' ? '' : match[0](match[1]);
    };
  },
} satisfies Subject;
