import { insertItem } from 'mapl-old/method';
import { countParams } from 'mapl-old/path';
import compile from 'mapl-old/method/compiler';

import type { Subject } from '../cases.js';

export const jit = {
  'basic-api': () => {
    const router = {};

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

    return Function(`return(m,p)=>{${compile(router, 'm', '', 0)}return ""}`)();
  },
} satisfies Subject;
