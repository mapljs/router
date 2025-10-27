import { createRouter, insertItem } from '@mapl/router/method';
import compile from '@mapl/router/method/compiler';
import { PATH, PATH_END, PATH_LEN, PATH_START } from '@mapl/router/constants';

export const write = (
  outdir: string,
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
    outdir + name.toLowerCase().replaceAll(' ', '-') + '.ts',
    `export default(r:Request)=>{${compile(router, 'r.method', `let ${PATH}=r.url,${PATH_START}=${PATH}.indexOf('/',12)+1,${PATH_END}=${PATH}.indexOf('?',${PATH_START}),${PATH_LEN}=${PATH_END}===-1?${PATH}.length:${PATH_END};`, 1)}};`,
  );
};

if (import.meta.main) {
  const OUTDIR = import.meta.dir + '/out/';

  write(OUTDIR, 'Simple API', {
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
}
