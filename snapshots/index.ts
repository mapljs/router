import { createRouter, insertItem } from '@mapl/router/method';
import compile from '@mapl/router/method/compiler';

const OUTDIR = import.meta.dir + '/out/';
const write = (
  name: string,
  methods: Record<string, Record<string, number>>,
) => {
  const router = createRouter<string>();
  for (const method in methods) {
    const routes = methods[method];
    for (const path in routes)
      insertItem(router, method, path, `return ${routes[path]}`);
  }
  Bun.write(
    OUTDIR + name.toLowerCase().replaceAll(' ', '-') + '.js',
    `export default(m,p)=>{${compile(router, 'm', '', 0)}};`,
  );
};

write('Simple API', {
  GET: {
    '/user': 0,
    '/user/comments': 1,
    '/user/avatar': 2,
    '/user/lookup/username/*': 3,
    '/user/lookup/email/*': 4,
    '/event/*': 5,
    '/event/*/comments': 6,
    '/map/*/events': 7,
    '/status': 8,
    '/very/deeply/nested/route/hello/there': 9,
  },
  POST: {
    '/event/*/comment': 10,
  },
});
