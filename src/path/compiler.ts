import type { Router } from './index.js';
import { compile } from '../tree/compiler.js';
import { isEmptyNode } from '../tree/node.js';

export default (router: Router<string>, startIndex: 0 | 1): string => {
  let str = '';
  for (let i = 1; i < router.length; i += 2)
    str +=
      (str === '' ? 'if(' : 'else if(') +
      constants.PATH +
      '==="' +
      router[i].slice(startIndex) +
      '"){' +
      router[i + 1] +
      '}';

  return (
    str +
    (isEmptyNode(router[0])
      ? ''
      : 'let ' +
        constants.PATH_LEN +
        '=' +
        constants.PATH +
        '.length;' +
        compile(router[0], 0, -startIndex, ''))
  );
};
