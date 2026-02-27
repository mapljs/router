import { createRouter, insertItem } from '@mapl/router/method';
import compile from '@mapl/router/method/compiler';
import { PATH } from '@mapl/router/constants';

import pc from 'picocolors';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Routes = {
  [key: string]: Routes | Method | [Method, ...Method[]];
};
type RouteList = [method: string, path: string, item: string][];

export const addRoutes = (
  routeList: RouteList,
  routes: Routes,
  log: typeof console.log,
  path: string = '/',
): void => {
  for (const key in routes) {
    const route = routes[key];
    const subpath = key === '/' ? path : path === '/' ? key : path + key;

    if (Array.isArray(route))
      for (const method of route) {
        log('  route:', method, subpath, routeList.length);
        routeList.push([method, subpath, `return ${routeList.length}`]);
      }
    else if (typeof route === 'string') {
      log('  route:', route, subpath, routeList.length);
      routeList.push([route, subpath, `return ${routeList.length}`]);
    } else addRoutes(routeList, route, log, subpath);
  }
};

const TIME_UNITS = ['ns', 'μs', 'ms', 's'];
const BYTE_UNITS = ['b', 'kb'];

const autoConvert = (val: number, units: string[]) => {
  let i = 0;
  for (; i < units.length - 1 && val > 1500; i++) val /= 1000;
  return Math.round(val * 100) / 100 + units[i];
};

export const write = (outdir: string, name: string, routes: Routes) => {
  console.log('API:', pc.bold(name));

  const routeList: RouteList = [];
  addRoutes(routeList, routes, process.env.DEBUG ? console.log : () => {});
  console.log('  routes:', routeList.length);

  let { addTime, compileTime, runTime, router, code } = Function(
    'createRouter',
    'insertItem',
    'compile',
    `
    'use strict';
    Bun.gc(true);

    let t_mock, t_start_add, t_end_add, t_end_compile, t_end_run;

    t_mock = Bun.nanoseconds();
    t_start_add = Bun.nanoseconds();

    let router = createRouter();
    ${routeList.map((route) => `insertItem(router,${route.map((x) => JSON.stringify(x)).join()})`).join(';')};

    t_end_add = Bun.nanoseconds();

    let code=\`(${PATH},m)=>{\${compile(router,'m',1)}return -1}\`;

    t_end_compile = Bun.nanoseconds();

    (0, eval)(code);

    t_end_run = Bun.nanoseconds();

    let t_variation = t_start_add - t_mock;

    return {
      addTime: t_end_add - t_start_add - t_variation,
      compileTime: t_end_compile - t_end_add - t_variation,
      runTime: t_end_run - t_end_compile - t_variation,
      router,
      code
    };
  `,
  )(createRouter, insertItem, compile);

  {
    console.log(
      '  add time:',
      pc.yellowBright(autoConvert(addTime, TIME_UNITS)),
    );

    console.log(
      '  compile time:',
      pc.yellowBright(autoConvert(compileTime, TIME_UNITS)),
    );

    console.log(
      '  run time:',
      pc.yellowBright(autoConvert(runTime, TIME_UNITS)),
    );

    console.log(
      '  total time:',
      pc.yellowBright(autoConvert(addTime + compileTime + runTime, TIME_UNITS)),
    );
  }

  {
    console.log(
      '  size:',
      pc.yellowBright(autoConvert(code.length, BYTE_UNITS)),
    );
  }

  const replacer = (_: any, v: any) =>
    v instanceof Map ? Object.fromEntries(v.entries().toArray()) : v;

  console.log(
    '  tree size:',
    pc.yellowBright(
      autoConvert(JSON.stringify(router, replacer).length, BYTE_UNITS),
    ),
  );

  {
    const filename = outdir + name.toLowerCase().replaceAll(' ', '-');
    Bun.write(
      filename + '.ts',
      `const d: (path: string, method: string) => number = ${code}; export default d;`,
    );
    Bun.write(filename + '.json', JSON.stringify(router, replacer, 2));
  }
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
