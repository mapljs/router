import type { Router } from './index.js';
import { compile } from '../tree/compiler.js';

export default (router: Router<string>, startIndex: 0 | 1): string => {
  let str = '';
  for (let i = 0, pairs = router[0]; i < pairs.length; i++)
    str +=
      'if(' +
      constants.PATH +
      '==="' +
      pairs[i][0].slice(startIndex) +
      '"){' +
      pairs[i][1] +
      '}';

  return (
    str +
    (router[1] === null
      ? ''
      : 'let ' +
        constants.PATH_LEN +
        '=' +
        constants.PATH +
        '.length;' +
        compile(router[1], 0, -startIndex, ''))
  );
};
