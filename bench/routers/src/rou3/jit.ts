import { compileRouter } from 'rou3/compiler';
import { basicAPI } from './_utils.js';

import type { Subject } from '../../cases.js';

export default {
  'basic-api': () => {
    const compiledMatch = compileRouter(basicAPI());

    return (method, path) => {
      const match = compiledMatch(method, path);
      return typeof match === 'undefined'
        ? ''
        : typeof match.params === 'undefined'
          ? // @ts-ignore
            match.data()
          : match.data(match.params);
    };
  },
} satisfies Subject;
