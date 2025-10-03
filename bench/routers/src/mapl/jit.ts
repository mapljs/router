import { createRouter, insertItem } from '@mapl/router/method';
import { countParams } from '@mapl/router/path';
import compile from '@mapl/router/method/compiler';

import type { Subject } from '../../cases.ts';

export default {
  'basic-api': () => {
    const router = createRouter<string>();

    // Insert helper for mapl
    const insert = (method: string, pat: string, id: number) => {
      // Count params
      if (pat.includes('*')) {
        let str = 'return"' + id + ': "+q0';
        for (let i = 1, params = countParams(pat); i < params; i++)
          str += '+" - "+q' + i;
        insertItem(router, method, pat, str);
      } else insertItem(router, method, pat, 'return "' + id + '"');
    };

    insert('GET', '/user', 0);
    insert('GET', '/user/comments', 1);
    insert('GET', '/user/avatar', 2);
    insert('GET', '/user/lookup/username/*', 3);
    insert('GET', '/user/lookup/email/*', 4);
    insert('GET', '/event/*', 5);
    insert('GET', '/event/*/comments', 6);
    insert('GET', '/map/*/events', 7);
    insert('GET', '/status', 8);
    insert('GET', '/very/deeply/nested/route/hello/there', 9);

    insert('POST', '/event/*/comment', 10);

    return Function(
      `'use strict';return(m,p)=>{${compile(router, 'm', '', 0)}return ""}`,
    )();
  },
} satisfies Subject;
