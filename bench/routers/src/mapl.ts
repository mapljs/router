import type { Subject } from "../cases.js";
import { insertItem } from "@mapl/router/method";
import compile from "@mapl/router/method/compiler";

export default {
  'basic-api': () => {
    const router = {};

    // Insert helper for mapl
    const insert = (method: string, pat: string, id: number) => {
      // Count params
      let params = 0;
      for (let i = 0; i < pat.length; i++)
        params += pat[i] === '*' ? 1 : 0;
      params -= pat.endsWith('**') ? 1 : 0;

      // Return
      let str = 'return"' + id;
      if (params === 0)
        str += '"';
      else {
        str += ': "';
        for (let i = 0; i < params; i++)
          str += '+q' + i + (i === params - 1 ? '' : '+" - "');
      }

      insertItem(router, method, pat, str);
    }

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
  }
} satisfies Subject;
