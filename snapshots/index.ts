import { createRouter, insertItem, type Router } from '@mapl/router/method';
import compile from '@mapl/router/method/compiler';
import { PATH } from '@mapl/router/constants';

import { do_not_optimize } from 'mitata';

import pc from 'picocolors';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Routes = {
  [key: string]: Routes | Method | [Method, ...Method[]];
};

export const addRoutes = (
  router: Router<string>,
  routes: Routes,
  log: typeof console.log,
  path: string = '/',
  idx: number = 0,
): number => {
  for (const key in routes) {
    const route = routes[key];
    const subpath = key === '/' ? path : path === '/' ? key : path + key;

    if (Array.isArray(route))
      for (const method of route) {
        log('  route:', method, subpath, idx);
        insertItem(router, method, subpath, `return ${idx++}`);
      }
    else if (typeof route === 'string') {
      log('  route:', route, subpath, idx);
      insertItem(router, route, subpath, `return ${idx++}`);
    } else idx = addRoutes(router, route, log, subpath, idx);
  }

  return idx;
};

const TIME_UNITS = ['ns', 'μs', 'ms', 's'];
const BYTE_UNITS = ['b', 'kb'];

export const write = (outdir: string, name: string, routes: Routes) => {
  console.log('API:', pc.bold(name));

  const router = createRouter<string>();
  console.log('  routes:', addRoutes(router, routes, process.env.DEBUG ? console.log : () => { }));

  // Measure comptime
  let start, end;

  Bun.gc(true);
  start = Bun.nanoseconds();
  const code = `(${PATH},m)=>{${compile(router, 'm', '', 1)}return -1}`;
  do_not_optimize(eval(code));
  end = Bun.nanoseconds();

  {
    let time = end - start, i = 0;
    for (; i < TIME_UNITS.length - 1 && time > 1500; i++)
      time /= 1000;
    console.log('  compile time:', pc.yellowBright(Math.round(time * 100) / 100 + TIME_UNITS[i]));
  }

  {
    let size = code.length, i = 0;
    for (; i < BYTE_UNITS.length - 1 && size > 1500; i++)
      size /= 1000;
    console.log('  size:', pc.yellowBright(Math.round(size * 100) / 100 + BYTE_UNITS[i]));
  }

  const filename = outdir + name.toLowerCase().replaceAll(' ', '-');
  Bun.write(
    filename + '.ts',
    `const d: (path: string, method: string) => number = ${code}; export default d;`,
  );
  Bun.write(filename + '.json', JSON.stringify(router, null, 2));
};

if (import.meta.main) {
  const OUTDIR = import.meta.dir + '/out/';

  write(OUTDIR, 'Medium-sized', {
    '/auth': {
      '/register': 'POST',
      '/login': 'POST',
      '/logout': 'POST',
      '/refresh': 'POST',
      '/password': {
        '/forgot': 'POST',
        '/reset': 'POST',
      },
      '/sso': {
        '/': 'POST',
        '/providers': 'GET',
      },
    },
    '/user': {
      '/': 'POST',
      '/*': {
        '/': ['GET', 'POST'],
        '/notifications': 'GET',
        '/invites': {
          '/': 'POST',
          '/*': {
            '/': 'GET',
            '/accept': 'POST',
            '/resend': 'POST',
          },
        },
      },
      '/me': {
        '/': ['GET', 'POST'],
        '/preferences': ['GET', 'PATCH'],
        '/sessions': {
          '/': 'GET',
          '/*': 'DELETE',
        },
      },
      '/notifications': {
        '/': 'GET',
        '/read-all': 'POST',
        '/*/read': 'POST',
      },
    },
    '/org': {
      '/': 'POST',
      '/*': {
        '/': ['GET', 'PATCH', 'DELETE'],
        '/members': {
          '/': ['GET', 'POST'],
          '/*': 'POST',
        },
        '/roles': {
          '/': ['GET', 'POST'],
          '/*': 'POST',
        },
        '/domains': {
          '/': ['GET', 'POST'],
          '/*': 'POST',
        },
        '/projects': {
          '/': 'POST',
          '/*': {
            '/': ['GET', 'PATCH', 'DELETE'],
            '/members': ['GET', 'POST'],
            '/activity': 'GET',
            '/tasks': {
              '/': ['GET', 'POST'],
              '/time-entries': {
                '/': ['GET', 'POST'],
                '/*/stop': 'POST',
              },
              '/attachments': ['GET', 'POST'],
              '/tags': ['POST', 'DELETE'],
              '/custom-fields/*': ['PUT', 'DELETE'],
            },
          },
        },
        '/tasks': {
          '/': 'GET',
          '/*': {
            '/': ['GET', 'PATCH', 'DELETE'],
            '/assign': 'POST',
            '/status': 'POST',
            '/comments': ['GET', 'POST'],
            '/time-entries': {
              '/': ['GET', 'POST'],
              '/*/stop': 'POST',
            },
            '/attachments': ['GET', 'POST'],
            '/tags': ['POST', 'DELETE'],
            '/custom-fields/*': ['PUT', 'DELETE'],
          },
        },
        '/billing': {
          '/plans': 'GET',
          '/subscription': {
            '/': ['GET', 'POST'],
            '/cancel': 'POST',
          },
          '/invoices': {
            '/': 'GET',
            '/*': ['GET', 'POST'],
          },
          '/payment-methods': {
            '/': ['GET', 'POST'],
            '/*': 'DELETE',
          },
        },
        '/api-keys': {
          '/': ['GET', 'POST'],
          '/*': 'DELETE',
        },
        '/webhooks': {
          '/': ['GET', 'POST'],
          '/*': ['PATCH', 'DELETE'],
          '/*/deliveries': {
            '/': 'GET',
            '/*': 'GET',
          },
        },
      },
    },
    '/files': {
      '/upload': 'POST',
      '/*': ['GET', 'DELETE'],
    },
    '/search': {
      '/': 'GET',
      '/filters': {
        '/': ['GET', 'POST'],
        '/*': ['PATCH', 'DELETE'],
      },
    },
    '/tags': {
      '/': ['GET', 'POST'],
      '/*': ['PATCH', 'DELETE'],
    },
    '/status': 'GET',
    '/admin': {
      '/reports': {
        '/time': 'GET',
        '/projects/*/summary': 'GET',
        '/users/*/activity': 'GET',
      },
      '/users': 'GET',
      '/projects': 'GET',
      '/audit-logs': 'GET',
      '/stats': 'GET',
      '/impersonate': 'POST',
      '/exports': {
        '/': 'POST',
        '/*': {
          '/': 'GET',
          '/cancel': 'POST',
        },
      },
    },
  });

  write(OUTDIR, 'Simple', {
    '/user': {
      '/': 'GET',
      '/comments': 'GET',
      '/avatar': 'GET',
      '/lookup': {
        '/username/*': 'GET',
        '/email/*': 'GET',
      },
    },
    '/event': {
      '/*': {
        '/': 'GET',
        '/comments': 'GET',
        '/comment': 'POST',
      },
    },
    '/map/*/events': 'GET',
    '/status': 'GET',
    '/very/deeply/nested/route/hello/there': 'GET',
    '/static/**': 'GET',
  });

  write(OUTDIR, 'Nested', {
    '/user': {
      '/': 'GET',
      '/*': {
        '/dashboard': {
          '/': 'GET',
          '/edit': 'GET',
        },
      },
    },
  });

  write(OUTDIR, 'Mutiple branch', {
    '/user/*': {
      '/dashboard': 'GET',
      '/account': 'GET',
      '/access': 'GET',
    },
  });
}
