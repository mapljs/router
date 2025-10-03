import { findRoute } from 'rou3';
import { basicAPI } from './_utils.ts';

import type { Subject } from '../../cases.ts';

export default {
  'basic-api': () => {
    const router = basicAPI();

    return (method, path) => {
      const match = findRoute(router, method, path);
      return typeof match === 'undefined' ? '' : match.data(match.params);
    };
  },
} satisfies Subject;
