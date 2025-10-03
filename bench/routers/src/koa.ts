import type { Subject } from '../cases.ts';
import KoaTreeRouter from 'koa-tree-router';

export const tree = {
  'basic-api': () => {
    const router = new KoaTreeRouter();

    router.get('/user', (_) => '0');
    router.get('/user/comments', (_) => '1');
    router.get('/user/avatar', (_) => '2');
    // @ts-ignore
    router.get('/user/lookup/username/:a', (map) => '3: ' + map[0].value);
    // @ts-ignore
    router.get('/user/lookup/email/:a', (map) => '4: ' + map[0].value);
    // @ts-ignore
    router.get('/event/:a', (map) => '5: ' + map[0].value);
    // @ts-ignore
    router.get('/event/:a/comments', (map) => '6: ' + map[0].value);
    // @ts-ignore
    router.get('/map/:a/events', (map) => '7: ' + map[0].value);
    router.get('/status', (_) => '8');
    router.get('/very/deeply/nested/route/hello/there', (_) => '9');

    // @ts-ignore
    router.post('/event/:a/comment', (map) => '10: ' + map[0].value);

    return (method, path) => {
      // @ts-ignore
      const match = router.find(method, path);
      return match.handle === null ? '' : match.handle[0](match.params);
    };
  },
} satisfies Subject;
