import { createRouter, addRoute } from 'rou3';

export const basicAPI = () => {
  type Handler = (params: Record<string, string>) => string;
  const router = createRouter<Handler>();

  addRoute(router, 'GET', '/user', () => '0');
  addRoute(router, 'GET', '/user/comments', () => '1');
  addRoute(router, 'GET', '/user/avatar', () => '2');
  addRoute(
    router,
    'GET',
    '/user/lookup/username/:a',
    (params) => '3: ' + params.a,
  );
  addRoute(
    router,
    'GET',
    '/user/lookup/email/:a',
    (params) => '4: ' + params.a,
  );
  addRoute(router, 'GET', '/event/:a', (params) => '5: ' + params.a);
  addRoute(router, 'GET', '/event/:a/comments', (params) => '6: ' + params.a);
  addRoute(router, 'GET', '/map/:a/events', (params) => '7: ' + params.a);
  addRoute(router, 'GET', '/status', () => '8');
  addRoute(router, 'GET', '/very/deeply/nested/route/hello/there', () => '9');

  addRoute(router, 'POST', '/event/:a/comment', (params) => '10: ' + params.a);
  return router;
};
