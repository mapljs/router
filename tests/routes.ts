export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type Routes = {
  [key: string]: Routes | Method | [Method, ...Method[]];
};
export type RouteList = [method: string, path: string, item: string][];

const addRoutes = (routeList: RouteList, routes: Routes, path: string): void => {
  for (const key in routes) {
    const route = routes[key];
    const subpath = key === '/' ? path : path === '/' ? key : path + key;

    if (Array.isArray(route))
      for (const method of route) {
        routeList.push([method, subpath, method + ' ' + subpath]);
      }
    else if (typeof route === 'string') {
      routeList.push([route, subpath, route + ' ' + subpath]);
    } else addRoutes(routeList, route, subpath);
  }
};

export const buildRoutes = (routes: Routes): RouteList => {
  const list: RouteList = [];
  addRoutes(list, routes, '/');
  return list;
};

export const routesList = {
  'simple api': buildRoutes({
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
  }),

  'complex api': buildRoutes({
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
  }),
};
